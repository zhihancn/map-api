import React, { useState, useEffect ,useRef} from "react";
import "./MapComponent.scss";
import AMapLoader from "@amap/amap-jsapi-loader";
import { FaMapMarkerAlt } from "react-icons/fa";

const MapComponent = ({transPoiId, poid ,attributes }) => {
  const [map, setMap] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [chooseTip, setChooseTip] = useState("");
  const [checkTip, setCheckTip] = useState("");

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);


  useEffect(() => {
    window._AMapSecurityConfig = {
      securityJsCode: attributes.securityKey,
    };
    AMapLoader.load({
      key: attributes.apiKey,
      version: "2.0",
      plugins: ["AMap.PlaceSearch"],
    })
      .then((AMap) => {
        const mapInstance = new AMap.Map(containerRef.current, {
          resizeEnable: true,
          zoom: 15,
        });
        if(1==1){
          var placeSearch = new AMap.PlaceSearch({
            // city: 'beijing', // 兴趣点城市
            // citylimit: true,  //是否强制限制在设置的城市内搜索
            pageSize: 10, // 单页显示结果条数
            children: 0, //不展示子节点数据
            pageIndex: 1, //页码
            extensions: "base", //返回基本地址信息
          });
          //详情查询
          placeSearch.getDetails(poid, function (status, result) {
            if (status === "complete" && result.info === "OK") {
              placeSearch_CallBack(result);
            }
          });
          var infoWindow = new AMap.InfoWindow({
            autoMove: true,
            offset: { x: 0, y: -30 },
          });
          //回调函数
          function placeSearch_CallBack(data) {
            var poiArr = data.poiList.pois;
            //添加marker
            var marker = new AMap.Marker({
              map: mapInstance,
              position: poiArr[0].location,
            });
            mapInstance.setCenter(marker.getPosition());
            infoWindow.setContent(createContent(poiArr[0]));
            infoWindow.open(mapInstance, marker.getPosition());
          }
          function createContent(poi) {
            //信息窗体内容
            var s = [];
            s.push("<b>名称：" + poi.name + "</b>");
            s.push("地址：" + poi.address);
            return s.join("<br>");
          }
        }
        setMap(mapInstance);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const settingSite = (value) => {
    if (map) {
      AMap.plugin(["AMap.AutoComplete", "AMap.PlaceSearch"], () => {
        var placeSearch = new AMap.PlaceSearch({
          pageSize: 5,
          pageIndex: 1,
          map: map,
          panel: panelRef.current,
        });
        placeSearch.search(value, function (status, result) {
          // 查询成功时，result即对应匹配的POI信息
        });

        placeSearch.on("selectChanged", function (e) {
          // console.log("eeeeee", e);
          setChooseTip(e.selected.id);
        });
      });
    }
  };

  return (
    <div style={{ width: "100%", border: "1px solid #ccc" }}>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          ref={inputRef}
          style={{
            height: "40px",
            width: "calc(100% - 41px)",
            borderRadius: "0px",
            border: "none",
            outline: "none",
            boxSizing: "border-box",
          }}
          name="tipinput"
          id="tipinput"
          type="text"
          placeholder="请输入关键字,按回车键搜索"
          onFocus={(e) => {
            e.target.style.boxShadow = "none";
          }}
          onKeyUp={(e) =>
            e.key === "Enter" ? settingSite(e.target.value) : ""
          }
        />
        <button
          style={{
            borderRadius: "0px",
            boxSizing: "border-box",
          }}
          className="tooltip-button"
          onMouseEnter={() => {
            setShowTooltip("点击采集坐标");
          }}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => {
            setShowTooltip("已采集！");
            setCheckTip(chooseTip);
            transPoiId(chooseTip);
          }}
        >
          <FaMapMarkerAlt />
        </button>
        {showTooltip && <div className={"tooltip"}>{showTooltip}</div>}
      </div>
      <div ref={panelRef} id={panelRef.current}></div>
      <div
       ref={containerRef}
        className="containers"
        id={containerRef.current}
        style={{ height: "400px" }}
      ></div>
    </div>
  );
};

export default MapComponent;
