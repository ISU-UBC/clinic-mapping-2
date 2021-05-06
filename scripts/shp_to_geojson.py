#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@author: omarkawach
"""

# Import packages
import pandas as pd
import geopandas as gpd
from geopandas import GeoDataFrame as gdf

# Load the shapefile as a geopandas data frame
gdf = gpd.read_file("../data/chsa_2018/CHSA_2018.shp")

# Set a CRS for the geopandas data frame
gdf = gdf.to_crs('epsg:4326')

# Set a file name
filename = "CHSA_2018"

# Insert the filename into the path to the data folder
url = '../data/{}.geojson'.format(filename)

gdf.to_file(url, driver='GeoJSON')