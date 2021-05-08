# CAMP Clinic List Map Choropleth

Click to access the [CAMP Clinic List Map Choropleth](https://isu-ubc.github.io/clinic-mapping-2/)

**Note**: If you're on mobile, rotate your device for best experience. 

## Description

This application hosts two layers to toggle through. One layer maps the number of family physicians per 100,000 based on the clinic list, and the other maps the number of family physicians per 100,000 based on the family physician list from CPSBC. The theme for both layers is [choropleth](https://sites.google.com/site/boardinclassrom/map/choropleth-map). 

## Features of the Application

- Map Container 
  - A view over some geography
  - View feature layers (points, and / or polygons)
  - Base maps 
  - OpenLayer Controls
    - Layer switcher to hide / show layers and base maps
    - Zoom in / out
    - Map scale
    - Full screen mode
    - Popup to show information of the clicked feature in a layer
    - Legend

## Getting Started

### Project Development

1. Clone the repo to your desired file directory
2. Download [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb) or [Live Server in VSCode](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
3. Open the web app in your preferred text editor if using Web Server for Chrome, otherwise use VSCode
4. Use [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/) for debugging
   - Ensure that cache is disabled in DevTools
5. Ensure the languages you work with are included in the system PATH

### Feeding the Application Information

#### The JSON

#### Polygon Layer Styling
##### Default

##### Custom

#### Point Layer Styling

##### Default

##### Custom

### File Conversions

##### Setup

1. Install [*Anaconda Navigator*](https://www.anaconda.com/)
2. Get GeoPandas
   - Open *Anaconda Prompt* as admin and create a new environment called ```geo_env```.
     - See full commands for this step at [*GeoPandas Getting Started*](https://geopandas.readthedocs.io/en/latest/getting_started/install.html#creating-a-new-environment)
3. Next, open *Anaconda Navigator* and click on ```Home``` and set ```Applications on``` to ```geo_env``` instead of ```base (root)```. 
   - Click the ```install``` button for *Spyder* in the *Anaconda Navigator*. 
4. After all these steps you should be ready to run the new environment in Spyder for Python scripting.
     - Additionally, run the following command in the Spyder terminal:  ```pip install openpyxl```

##### Use Python Script to Convert SHP to GeoJSON

##### Use Python Script to Convert from Excel to GeoJSON

##### Use Python Script to Identify Clinics by ID

##### Use Python Script to Solve for Physicians by Population



## Authors

[Innovation Support Unit - Department of Family Practice at UBC](https://isu.familymed.ubc.ca/)

[Omar Kawach - Consultant](https://omarkawach.github.io/)

## Credit and Acknowledgements

[Bruno St-Aubin at Statistics Canada - Components](https://github.com/SGC-CGS/geo-explorer)

[OpenLayers - Source Code](https://github.com/openlayers/openlayers)

[Jean-Marc Viglino - OpenLayers Extension](https://github.com/Viglino/ol-ext)

[Matt Walker - OpenLayers LayerSwitcher](https://github.com/walkermatt/ol-layerswitcher)

[White Google Maps Pin](http://www.clker.com/clipart-white-google-map-pin-1.html)

## Resources

#### Styling

[D3 Color Schemes](https://observablehq.com/@d3/color-schemes)

[ColorBrewer Cartography Color Advice](https://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3)

#### GIS

[Spatial References](https://spatialreference.org/ref/epsg/)

#### OpenLayers

[OpenLayers Documentation](https://openlayers.org/en/latest/doc/)