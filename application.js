"use strict";

import Core from "./tools/core.js";
import Templated from "./components/templated.js";
import Map from "./ol/map.js";
import Style from "./tools/style.js"
import Scales from "./tools/scales.js";

/**
 * The Application module 
 * @module application
 * @extends Templated
 * @description For building the application
 */
export default class Application extends Templated {
  constructor(node, config) {
    super(node);

    this.config = config;

    this.numLayers = 0;

    this.LoadMap();

    this.LoadLayers();

    this.AddLayerSwitcher();
  }

  /**
   * @description Instantiate the map, set the view and add onClick events 
   */
  LoadMap() {
    this.map = new Map(this.Elem("map"), [
      Map.BasemapOSM(),
      Map.BasemapSatellite(true),
    ]);

    this.DeviceViewOfMap();

    this.map.On("click", this.onMap_Click.bind(this));
  }

  /**
   * @description Change the zoom level on the map
   * based on device (mobile or desktop)
   */
  DeviceViewOfMap() {
    let view = this.config.view;

    let mobileView = 4;

    let desktopView = 5;

    var isMobile = window.orientation > -1;

    isMobile ? this.map.SetView(view, mobileView) : this.map.SetView(view, desktopView);
  }

  /**
   * @description Load layers onto the map and style them
   * based on the configuration in application.json. Also, update
   * the legend based on which layers are visible.
   * @note If you're going to configure two layers to be visible 
   * at the same time then don't forget that polygon layers 
   * should go underneath point layers.
   */
  LoadLayers() {
    // Show wait.gif while the layers are being loaded
    this.Elem("wait").hidden = false;

    let layerName;

    for (layerName in this.config.layers) {

      this.map.AddGeoJSONLayer(
        this.config.layers[layerName].id, 
        this.config.layers[layerName].shapeType,
        this.config.layers[layerName].url,
        this.config.layers[layerName].title
      );

      this.map.OL.once('rendercomplete', this.StyleLayers.bind(this));
    }
  }

  /**
   * @description Check the configuration for 
   * the styling options and style each layer accordingly.
   * The scale functions will support the development of the legend.
   */
  StyleLayers() {
    let layerTitle = Object.keys(this.config.layers)[this.numLayers];

    let layerConfig = this.config.layers[layerTitle];

    let layer = this.map.layers[layerConfig.id];

    if (layerConfig.style.styleType == "default") {
      layer.setStyle(Style.GetStyle(layerConfig.shapeType, layerConfig.style));
    } else {
      this.StyleLayerAsCustom(layerConfig, layer);
    }

    layer.setOpacity(layerConfig.style.opacity)

    layer.set("visible", layerConfig.visible);

    // Update the legend when visibility changes
    layer.on('change:visible', this.GetLegend.bind(this));

    this.numLayers += 1;

    this.GetLegend();

    this.Elem("wait").hidden = true;
  }

  StyleLayerAsCustom(layerConfig, layer) {
      let proportionalID = layerConfig.style.theme.size.proportional;

      let IdentifierID = layerConfig.style.theme.color.identified;

      let choroplethID = layerConfig.style.theme.color.choropleth;

      let colorScheme = layerConfig.style.theme.color.scheme;

      let ranking = layerConfig.style.theme.color.ranking;

      if (layerConfig.style.theme.size.proportional != "") {
        layerConfig.style.sizeFn = Scales.GetProportionFn(layer.getSource().getFeatures(), proportionalID);
      }

      if (layerConfig.style.theme.color.identified != "") {
        layerConfig.style.colorFn = Scales.GetIdentifierFn(layer.getSource().getFeatures(), IdentifierID, colorScheme);
      } 
      
      else if (layerConfig.style.theme.color.choropleth != "") {
        layerConfig.style.colorFn = Scales.GetChoroplethFn(layer.getSource().getFeatures(), choroplethID, colorScheme, ranking);
      }

      // Style each feature in the layer
      layer.getSource().getFeatures().forEach(feature => {
        layerConfig.style.sizeFnVal = feature.getProperties()[proportionalID];

        if(IdentifierID != "") {
          layerConfig.style.colorFnVal = feature.getProperties()[IdentifierID];
        } 
        
        else if (choroplethID != "") {
          layerConfig.style.colorFnVal = feature.getProperties()[choroplethID];
        }

        feature.setStyle(Style.GetStyle(layerConfig.shapeType, layerConfig.style));
      });
  }

  CreateBaseLegend() {
    this.legend = new ol.control.Legend({
      legend: new ol.legend.Legend({ 
        title: 'Legend Container',
      })
    });

    this.map.AddControl(this.legend);

    this.legend.collapse();
  }


  // Non default styles will need a legend
  GetLegend() {
    // Because we should start the legend from scratch each time
    this.map.RemoveControl(this.legend);

    this.CreateBaseLegend();

    Object.keys(this.map.layers).forEach( (id) => {
      // For each visible layer, see if a legend should be created
      let visible = this.map.layers[id].getVisible();

      let title = this.map.layers[id].getProperties().title;

      let style = this.config.layers[title].style;

      // Default styled layers don't need a legend
      if (visible == false || style.styleType == "default") {
        return;
      } 
      // Otherwise try to add each theme to the legend
      else {
        this.AddThematicLegend(title, style)
      }
    })
  }

  // Change to Size and Color Legend
  AddThematicLegend(title, style) {

    if(style.theme.color.choropleth != "") {
      this.ChoroplethLegend(title, style);
    }

    else if(style.theme.color.identified != "") {
      this.IdentifiedLegend(title, style);
    } 

    if(style.theme.size.proportional != "") {
      this.ProportionalLegend(title, style);
    }
  }

  ChoroplethLegend(title, style) {

    if (style.colorFn == undefined) return;

    let legend = new ol.legend.Legend({ 
      title: style.theme.color.legend,
      margin: 15
    });

    let prev = null;

    for (let index = 0; index < style.colorFn.domain().length; index++) {

      let domainVal = Math.round(style.colorFn.domain()[index]);

      let curr = JSON.stringify(domainVal);

      let range = style.colorFn.range()[index];

      legend.addItem({
        title: (prev) ? `${prev} - ${curr}` : `0 - ${curr}`,
        typeGeom: "Point",
        style: Style.CircleStyle(range)
      }); 

      prev = curr;
    }

    this.map.AddControl(new ol.control.Legend({
      legend: legend,
      target: this.legend.element
    }));
  }

  IdentifiedLegend(title, style) {
    
    if (style.colorFn == undefined) return;

    let legend = new ol.legend.Legend({ 
     title: style.theme.color.legend,
     margin: 15
   });
   
   for (let index = 0; index < style.colorFn.domain().length; index++) {

     let domain = style.colorFn.domain()[index];

     let range = style.colorFn.range()[index];

     legend.addItem({
       title: domain,
       typeGeom: "Point",
       style: Style.CircleStyle(range)
     }); 
   }

   this.map.AddControl(new ol.control.Legend({
     legend: legend,
     target: this.legend.element
   }));
 }

  ProportionalLegend(title, style) {

    if (style.sizeFn == undefined) return;
    
    var legend = new ol.legend.Legend({ 
      title: style.theme.size.legend,
      margin: 15
    });

    let prev = null;

    for (let index = 0; index < style.sizeFn.domain().length; index++) {

      let domainVal = Math.round(style.sizeFn.domain()[index]);

      let curr = JSON.stringify(domainVal);

      let range = style.sizeFn.range()[index];

      legend.addItem({
        title: (prev) ? `${prev} - ${curr}` : `0 - ${curr}`,
        typeGeom: "Point",
        style: new ol.style.Style({
          image: new ol.style.Icon({ src: style.icon, scale: range }),
        }),
      }); 
      
      prev = curr;
    }  

    this.map.AddControl(new ol.control.Legend({
      legend: legend,
      target: this.legend.element
    }));
  }  

  /**
   * @description Add a LayerSwitcher (control) to the map
   */
   AddLayerSwitcher() {
    const ls = new LayerSwitcher({
      reverse: true,
      groupSelectStyle: "group",
      tipLabel: 'base'
    });

    this.map.AddControl(ls);
  }

  onMap_Click(ev) {
    this.ResetSelected();

    this.selected = ev.features.length > 0 ? ev.features[0] : null;

    if (this.selected) {
      this.HighlightSelected();

      let unformattedFields = this.config.layers[this.selected.layer].popup.unformatted;

      let formattedFields = this.config.layers[this.selected.layer].popup.formatted;

      let props = this.selected.feature.getProperties();

      let content = "<ul>";

      content += `<li style="font-weight: bold">${this.selected.layer}</li>`;

      for (let index = 0; index < formattedFields.length; index++) {
        let field = formattedFields[index];
        let key = unformattedFields[index];
        let val = props[key];
        if (!isNaN(val) && (typeof(val) == "string")) {
          let fixed = parseFloat(val).toFixed(1);
          content += `<li>${field}: ${fixed}</li>`;
        } else {
          content += `<li>${field}: ${val}</li>`;
        }
      }

      content += "</ul>";

      this.map.ShowPopup(ev.coordinates, content);
    } else {
      this.map.ShowPopup(null);
    }
  }

  ResetSelected() {
    if (!this.selected) return;

    let style = this.ResetFeatureStyle(this.selected.feature)

    this.selected.feature.setStyle(style);
  }

  HighlightSelected() {
    if (!this.selected) return;

    let style = this.SetFeatureHighlightStyle(this.selected.feature)

    this.selected.feature.setStyle(style);
  }

  SetFeatureHighlightStyle() {
    let type = this.GetSelectedType();

    let json = this.config.layers[this.selected.layer].style;

    return Style.GetHighlightStyle(type, json);
  }

  ResetFeatureStyle(){
    let type = this.GetSelectedType();

    let json = this.config.layers[this.selected.layer].style

    if(json.theme.size.proportional != "") {
      let val = this.selected.feature.getProperties()[json.theme.size.proportional]
      json.sizeFnVal = val;
    }

    if(json.theme.color.choropleth != "") {
      let val = this.selected.feature.getProperties()[json.theme.color.choropleth]
      json.colorFnVal = val;
    }

    if(json.theme.color.identified != "") {
      let val = this.selected.feature.getProperties()[json.theme.color.identified]
      json.colorFnVal = val;
    }

    return Style.GetStyle(type, json);
  }

  GetSelectedType() {
    return this.config.layers[this.selected.layer].shapeType
  }

  /**
   * Create a div for this widget
   * @returns {string} HTML with custom div
   */
  Template() {
    return (
      "<main handle='main'>" +
        "<div handle='map' class='map'>" +
          "<div id='wait' handle='wait' class='wait' hidden><img src='./assets/loading.gif'></div>" + 
        "</div>" +
      "</main>"
    );
  }
}
