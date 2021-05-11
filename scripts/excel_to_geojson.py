#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@author: omarkawach
@description: Convert an Excel sheet to GeoJSON
"""

# Import packages
import pandas as pd
import geopandas as gpd
from geopandas import GeoDataFrame as gdf

# Load the excel sheet as a pandas data frame
excel_data_df = pd.read_excel('../data/clinic_list.xlsx')

# Convert the pandas data frame into a geopandas data frame 
gdf = gpd.GeoDataFrame(
    excel_data_df, geometry=gpd.points_from_xy(excel_data_df.GEO_LONGITUDE, excel_data_df.GEO_LATITUDE))

# Set a CRS for the geopandas data frame
gdf = gdf.set_crs('epsg:4326')

# Set a file name
filename = "clinic_list"

# Insert the filename into the path to the data folder
url = '../data/{}.geojson'.format(filename)

# Convert the geopandas data frame inot a geojson file
gdf.to_file(url, driver='GeoJSON')
