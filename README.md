## Processing the spreadsheets

```bash
./processwards.py data/Democratic\ Bullet\ Voting\ \(FINAL\).xlsx\ -\ Division\ Results.csv data/dem_processed_wards.geojson > data/dem_processed_wards.csv
./processdivisions.py data/Democratic\ Bullet\ Voting\ \(FINAL\).xlsx\ -\ Division\ Results.csv data/dem_processed_divisions.geojson > data/dem_processed_divisions.csv
./processwards.py data/Republican\ Bullet\ Voting\ \(FINAL\).xlsx\ -\ Division\ Results.csv data/rep_processed_wards.geojson > data/rep_processed_wards.csv
./processdivisions.py data/Republican\ Bullet\ Voting\ \(FINAL\).xlsx\ -\ Division\ Results.csv data/rep_processed_divisions.geojson > data/rep_processed_divisions.csv
```

Upload the processed data to a new dataset in CartoDB.

Change the following columns to number:
* `_0_votes`
* `_1_votes`
* `_2_votes`
* `_3_votes`
* `_4_votes`
* `_5_votes`
* `top_bullet_votes`


## Creating a new visualization

Find the top bullet vote getters with:
```sql
SELECT top_bullet, SUM(top_bullet_votes) AS total
FROM <table>
GROUP BY top_bullet
ORDER BY total DESC
```

Paste in the *map_query.sql*.

Create a chloropleth map on the `top_bullet_scale` field.

Copy the CSS and update the *rep_* or *dem_division_map_style.css* file.

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
