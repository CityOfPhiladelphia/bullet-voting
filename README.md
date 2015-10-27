# Bullet Voting in Philadelphia

A visualization of the instances of bullet voting for at-large city council candidates in Philadelphia's 2015 primary elections.

http://cityofphiladelphia.github.io/bullet-voting/

## Processing the spreadsheets

The original data received for the visualization was compiled by hand in *data/Democratic Bullet Voting.csv* and *data/Republican Bullet Voting.csv*. To prepare the data for visualization, we use first the scripts *processwards.py* and *precessdivisions.py* to clean up the data and precalculate some useful values (NOTE: these scripts require Python 2.7 or above).

To install the dependencies for these scripts, run:

```bash
pip install -r requirements.txt
```

Next, to actually process the data, we run:

```bash
./processwards.py data/Democratic\ Bullet\ Voting.csv data/dem_processed_wards.geojson > data/dem_processed_wards.csv
./processdivisions.py data/Democratic\ Bullet\ Voting.csv data/dem_processed_divisions.geojson > data/dem_processed_divisions.csv
./processwards.py data/Republican\ Bullet\ Voting.csv data/rep_processed_wards.geojson > data/rep_processed_wards.csv
./processdivisions.py data/Republican\ Bullet\ Voting.csv data/rep_processed_divisions.geojson > data/rep_processed_divisions.csv
```

## Visualizing the data

Upload each of the the processed data GeoJSON files to a new dataset in CartoDB. Change the type of the following columns to number:
* `_0_votes`
* `_1_votes`
* `_2_votes`
* `_3_votes`
* `_4_votes`
* `_5_votes`
* `top_bullet_votes`

Create new maps for the district tables. To configure the map styles, first find the candidates that got the most bullet votes across the city with the following query:
```sql
SELECT top_bullet, SUM(top_bullet_votes) AS total
FROM <table>
GROUP BY top_bullet
ORDER BY total DESC
```

Use the query in *cartodb/map_query.sql* file as a starting point for the query for your map (replace `cartodb_query` with the name of your table).

Create a chloropleth map on the `top_bullet_scale` field.

Copy the CSS and update the *cartodb/rep_* or *cartodb/dem_division_map_style.css* file. Use this as your new map CSS.

Publish the map and update the API URL in *main.js*


## Overwriting the data

`TRUNCATE` the old dataset.

Get the names of all the columns by exporting the (now empty) table to CSV. The first row is your column names. Get rid of the `cartodb_id` column. We explicitly specify the columns so that we can ensure that all the columns are in the same order.

Copy over the new data with:
```sql
INSERT INTO <table> (<columns>)
SELECT <columns> FROM <table>_1;
```

Recopy the query from *map_query.sql* into CartoDB.
