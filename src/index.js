import React  from "react";
import MapComponent from "./MapComponent";
import FrontMap from "./FrontMap";

wp.blocks.registerBlockType("myplugin/gaode-map-api", {
  title: "apiMap",
  icon: "location-alt",
  category: "common",
  attributes: {
    poid: { type: "string" },
    apiKey: {type: "string" , default: "" },
    securityKey: {type:"string" , default: "" },
  },
  edit: function (props) {

    // 从全局变量中获取数据
    if (typeof mypluginData !== 'undefined' && mypluginData.dbData) {
      props.setAttributes({
        apiKey: mypluginData.dbData.apiKey,
        securityKey: mypluginData.dbData.securityKey
      });
    }
    const handleValueChange = (newValue) => {
        props.setAttributes({ poid: newValue });
        // console.log("Received value from MapComponent:", newValue);
    };
    return (
      <div>
        <MapComponent transPoiId={handleValueChange} poid={props.attributes.poid} attributes={props.attributes}/>
      </div>
    );
  },
  save: function (props) {
    return null;
  },
});
