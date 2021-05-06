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
file = "../data/CHSA_2018.geojson"

# Load the geojson as a geopandas data frame
gdf = gpd.read_file(file)

# Load the excel sheet as a pandas data frame
excel_data_df = pd.read_excel('../data/clinic_list.xlsx')

# Formula = # physicians / CHSA population * 100,000

# Get a list of the CHSA names
chsa = gdf['CHSA_Name'].tolist()

# Convert the list to a dictionary and fill it with zeroes
chsa_dict = { i : 0 for i in chsa}

# Add new columns to geodataframe
gdf["PHYS_CAPITA"] = None
gdf["NUM_PHYS"] = None

# If we find a CHSA, add the sum to it
for index, row in excel_data_df.iterrows():
    # Avoid nan values
    if(not pd.isnull(row['CHSA_NAME'])):
        chsa_dict[row['CHSA_NAME']] += row['NUM_PHYSICIANS']
        
# Add the formula to the PHYS_CHSA column
for index, row in gdf.iterrows():
    r = row['CHSA_Name']
    if(not pd.isnull(r)):
        capita = ((chsa_dict[r] / gdf.at[index, 'CHSA_Pop16']) * 100000)
        gdf.at[index, 'PHYS_CAPITA'] = round(capita, 2)
        gdf.at[index, 'NUM_PHYS'] = chsa_dict[r]


# Overwrite the existing copy
gdf.to_file(file, driver='GeoJSON')
