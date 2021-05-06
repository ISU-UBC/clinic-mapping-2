export default class Style {
  static GetStyle(type, json) {

    if (json.styleType == "default") {

      if (type == "point") return this.DefaultPointStyle(json);

      if (type == "polygon") return this.DefaultPolygonStyle();

    } else {

      if (type == "point") return this.PointStyle(json);

      if (type == "polygon") return this.PolygonStyle(json);
    }
    
  }

  static DefaultPolygonStyle() {
    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(100,100,180,1)",
      }),
      stroke: new ol.style.Stroke({
        color: "rgba(255,255,255,1)",
        width: 1,
      }),
    });
  }

  static DefaultPointStyle(json) {
    return new ol.style.Style({
      image: new ol.style.Icon({
        src: json.icon,
        color: "rgba(255, 255, 225, 1)",
        scale: 0.075,
      }),
    });
  }

  static PolygonStyle(json) {
    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: json.strokeColor,
        width: 1,
      }),
      fill: new ol.style.Fill({
        color: this.StyleFunction(json.color, json.colorFn, json.colorFnVal)
      }),
    });
  }

  static PointStyle(json) {
    return new ol.style.Style({
      image: new ol.style.Icon({
        src: json.icon,
        color: this.StyleFunction(json.color, json.colorFn, json.colorFnVal),
        scale: this.StyleFunction(json.scale, json.sizeFn, json.sizeFnVal),
      }),
    });
  }

  static StyleFunction(defaultFromJson, themeFn, val) {

    if (val == undefined || val == null) {
      return;
    } else if (themeFn != null) {
      return themeFn(val);
    } else {
      return defaultFromJson;
    }
  }

  static GetHighlightStyle(type, json) {
    if (type == "point") return this.PointHighlightStyle(json);

    if (type == "polygon") return this.PolygonHighlightStyle();
  }

  static PolygonHighlightStyle() {
    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(0,200,200,0.6)",
      }),
      stroke: new ol.style.Stroke({
        color: "rgba(0,255,255,1)",
        width: 1,
      }),
    });
  }

  static PointHighlightStyle(json) {
    return new ol.style.Style({
      image: new ol.style.Icon({
        src: json.icon,
        color: "rgba(0, 200, 200, 1)",
        scale: 0.10,
      }),
    });
  }

  static CircleStyle(fill) {
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: 15,
        radius2: 7,
        stroke: new ol.style.Stroke({ color: [0, 0, 0, 1], width: 1.5 }),
        fill: new ol.style.Fill({ color: fill || [0, 255, 255, 0.3] }),
      }),
    });
  }
}
