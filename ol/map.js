import Evented from "../components/evented.js";

/**
 * The Map module
 * @module ol/map
 * @extends Templated
 * @description Builds the map container, and has various
 * functions for layers, basemaps, and controls.
 */
export default class Map extends Evented {

	/**
	 * @description The open layers map container
	 */
	get OL() {
		return this._ol;
	}

	/**
	 * @description Get the layers in the map instance
	 */
	get Layers() {
		return this.layers;
	}

	constructor(container, basemaps) {
		super();

		this.layers = {};

		// OL controls to add
		var sl = new ol.control.ScaleLine();
		var fs = new ol.control.FullScreen();

		this.basemaps = basemaps;

		// Send the map to the target div
		this._ol = new ol.Map({
			renderer: (['webgl', 'canvas']),
			target: container,
			layers: [new ol.layer.Group({
				title: 'Basemaps',
				layers: basemaps
			})],
			controls: ol.control.defaults({ attributionOptions: { collapsible: true } }).extend([fs, sl]),
		});

		// For handling map on click events
		this._ol.on("click", (ev) => {
			var features = [];

			this._ol.forEachFeatureAtPixel(ev.pixel, function (feature, layer) {
				features.push({ layer: layer.get('title'), feature: feature });
			});

			this.Emit("click", { "features": features, "coordinates": ev.coordinate });
		})

		// Get the projection from the basemap
		this.projection = basemaps[0].getSource().getProjection();

		// Add popup to the map container
		this.popup = new ol.Overlay.Popup();
		this.OL.addOverlay(this.popup);
	}

	/**
	 * @description Get the layer by ID
	 * @param {String} id 
	 * @returns The layer
	 */
	Layer(id) {
		return this.layers[id];
	}

	/**
	 * @description Add a control to the map container
	 * @param {*} control 
	 * @param {*} options 
	 */
	AddControl(control, options) {
		options = options || {};

		options.map = this.OL;

		this.OL.addControl(control);
	}

	/**
	 * @description Remove a control from the map container
	 * @param {*} control 
	 */
	RemoveControl(control) {
		this.OL.removeControl(control);
	}

	/**
	 * @description Add the GeoJSON to the map container. 
	 * By using VectorImage, we get faster (and less accurate) 
	 * rendering during interaction and animations
	 * @param {String} id - ID for identifying layer in the map instance
	 * @param {String} type - Polygon or Point
	 * @param {String} url - Path to the GeoJSON file
	 * @param {String} title - Title to show in the layer switcher and popup
	 * @returns The added layer
	 */
	AddGeoJSONLayer(id, type, url, title) {
		let format = new ol.format.GeoJSON({ featureProjection: this.projection });

		let vs = new ol.source.Vector({ url: url, format: format });

		let vector = new ol.layer.VectorImage({ source: vs, title: title, type: type });

		return this.AddLayer(id, vector);
	}

	/**
	 * @description Add a layer to the map container 
	 * @param {*} id - A way to identify the layer in the map instance
	 * @param {*} layer - The layer to be added
	 * @returns The added layer
	 */
	AddLayer(id, layer) {
		this.OL.addLayer(layer);

		this.layers[id] = layer;

		return layer;
	}

	/**
	 * @description Set the view of the map container over a 
	 * coordinate and set a zoom level
	 * @param {Array} coord - coordinates [lon, lat]
	 * @param {Number} zoom - zoom level 
	 */
	SetView(coord, zoom) {
		this.OL.setView(new ol.View({
			center: ol.proj.transform(coord, "EPSG:4326", "EPSG:900913"),
			zoom: zoom,
		}));
	}

	/**
	 * @description Show the popup by setting the position
	 * to where the user clicked
	 * @param {*} coord - Position where user clicked
	 * @param {*} content - Content to show on the popup
	 */
	ShowPopup(coord, content) {
		this.popup.setPosition(coord);

		this.popup.show(coord, content);
	}

	/**
	 * @descriptionGet the OpenStreetMap basemap from SOM
	 * @param {Boolean} visible - To show or hide basemap
	 * @returns An OpenLayers tile 
	 */
	static BasemapOSM(visible) {
		return new ol.layer.Tile({
			title: "OpenStreetMap",
			source: new ol.source.OSM(),
			visible: !!visible,
			baseLayer: true
		});
	}

	/***
	 * @description Get the satellite basemap from ESRI
	 * @param {Boolean} visible - To show or hide basemap
	 * @returns An OpenLayers tile 
	 */
	static BasemapSatellite(visible) {
		return new ol.layer.Tile({
			title: "Satellite",
			source: new ol.source.XYZ({
				attributions: ['Powered by Esri', 'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
				attributionsCollapsible: false,
				url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
				maxZoom: 23
			}),
			visible: !!visible,
			baseLayer: true
		});
	}
}