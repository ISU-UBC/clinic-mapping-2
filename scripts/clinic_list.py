#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@author: omarkawach
@note: This script assumes you already converted your shape file to geojson
"""

# Import packages
import pandas as pd
import geopandas as gpd
from geopandas import GeoDataFrame as gdf

# The file and the path to it
file = "../data/V2_Layer2_Data.geojson"

# Load the geojson as a geopandas data frame
gdf = gpd.read_file(file)

for index, row in gdf.iterrows():
    r = row['ID']
    r = r.rsplit('_', 1)[0]
    gdf.at[index, 'ID'] = r
    
# Overwrite the existing copy
gdf.to_file(file, driver='GeoJSON')
