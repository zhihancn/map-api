import React , {  useEffect ,useRef} from "react";
import ReactDOM from "react-dom";
import AMapLoader from "@amap/amap-jsapi-loader";

const divsToUpdate = document.querySelectorAll(".map-front-page");
//多模块前台展示
divsToUpdate.forEach(function (div) {
  const data = JSON.parse(div.querySelector("pre").innerHTML);
  ReactDOM.render(<Quiz {...data} />, div);
  div.classList.remove("map-front-page");
});

function Quiz(props) {
  const containerRef = useRef(null);
  console.log('aaaaaaatttttt',props);

  useEffect(() => {
    window._AMapSecurityConfig = {
      securityJsCode: props.securityKey,
    };

    AMapLoader.load({
      key: props.apiKey,
      version: "2.0",
      plugins: ["AMap.PlaceSearch"],
    })
      .then((AMap) => {
        const map = new AMap.Map(containerRef.current, {
          zoom: 15,
        });
        var placeSearch = new AMap.PlaceSearch({
          // city: 'beijing', // 兴趣点城市
          // citylimit: true,  //是否强制限制在设置的城市内搜索
          pageSize: 10, // 单页显示结果条数
          children: 0, //不展示子节点数据
          pageIndex: 1, //页码
          extensions: "base", //返回基本地址信息
        });
        //详情查询
        placeSearch.getDetails(props.poid, function (status, result) {
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
            map: map,
            position: poiArr[0].location,
          });
          map.setCenter(marker.getPosition());
          infoWindow.setContent(createContent(poiArr[0]));
          infoWindow.open(map, marker.getPosition());
        }
        function createContent(poi) {
          //信息窗体内容
          var s = [];
          s.push("<b>名称：" + poi.name + "</b>");
          s.push("地址：" + poi.address);
          return s.join("<br>");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div style={{ width: "100%", border: "1px solid #ccc" }}>
      <div
        className="containers"
        ref={containerRef}
        id={containerRef.current}
        style={{ height: "400px" }}
      ></div>
    </div>
  );
}
