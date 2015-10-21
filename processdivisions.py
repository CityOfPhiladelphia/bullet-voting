#!/usr/bin/env python

import csv
import click
import json
import sys
from os.path import join as pathjoin, dirname, abspath


ROOT = abspath(dirname(__file__))


def finalizeward(wardnum, wardrow, fieldnames, bulletindex, doubleindex, writer, wards, outfields):
    wardrow.insert(0, wardnum)
    cleanward = '{:0>2}'.format(wardnum)

    # Calculate the top bullet and pair getters
    topbulletcount = max(wardrow[bulletindex:doubleindex])
    topbulletindex = wardrow.index(topbulletcount, bulletindex, doubleindex)
    topbullet = fieldnames[topbulletindex]
    topdoublecount = max(wardrow[doubleindex:])
    topdoubleindex = wardrow.index(topdoublecount, doubleindex)
    topdouble = fieldnames[topdoubleindex]

    # Output each ward's row as it's claculated.
    outrow = ([wardnum, cleanward] +
              [topbullet, topbulletcount] +
              [topdouble, topdoublecount] + wardrow[1:])
    writer.writerow(outrow)

    feature = {'type': 'Feature',
               'properties': dict(zip(outfields, outrow)),
               'geometry': wards[str(wardnum)]['geometry']}
    return feature


@click.command()
@click.argument('incsvfilename', nargs=1, type=click.Path())
@click.argument('outjsonfilename', nargs=1, type=click.Path())
def process_csvs(incsvfilename, outjsonfilename):
        with open(pathjoin(ROOT, 'data', 'GIS_PLANNING.Political_Divisions.geojson')) as jsonfile:
            # Index the divisions by division number
            divisions_geojson = json.load(jsonfile)
            divisions = {
                str(feature['properties']['DIVISION_NUM']): feature
                for feature in divisions_geojson['features']
            }

        with open(incsvfilename, 'rU') as csvfile:
            # Start reading in as a CSV file
            reader = csv.reader(csvfile)

            # Get rid of the first row, but remember where the pairs start
            legend = next(reader)
            bulletindex = legend.index('Bullet Votes Per Candidate')
            doubleindex = legend.index('Double Bullet Pairs')

            # Read and fix the header
            fieldnames = list(next(reader))
            fieldnames[1:7] = ['{} Votes'.format(v)
                               for v in range(0, 6)]

            # Clean up the headers for pair candidates
            i = doubleindex
            while i < len(fieldnames):
                fieldnames[i] = fieldnames[i].replace(' ', ' & ')
                i = i + 1

            # Print the header row
            outfields = (['Ward', 'Division', 'WardDiv', 'Ward-Division'] +
                         ['Top Bullet', 'Top Bullet Votes'] +
                         ['Top Pair', 'Top Pair Votes'] + fieldnames[1:])
            writer = csv.writer(sys.stdout)
            writer.writerow(outfields)

            currentward = None
            wardrow = None
            data = {
                'type': 'FeatureCollection',
                'features': []
            }

            # Start building up the list of data
            for row in reader:
                # Get rid of any rows that have an empty first cell. This
                # includes:
                # - empty rows
                # - the totals row at the end
                if not row[0]:
                    continue

                # Replace zeros with nothing.
                row = ['' if v == '0' else v
                       for v in row]

                # Get rid of spaces in the first column and normalize the
                # division string.
                row[0] = row[0].replace(' ', '')
                ward, division = row[0].split('-')
                warddiv = '{:0>2}{:0>2}'.format(ward, division)

                # Ward 13 Division 14 in the original spreadsheet had a
                # backslash (\) in the 0 Votes column.
                row = [0 if v == '\\' else v for v in row]

                # Calculate the top bullet and pair getters
                def calculate_tops(start, end=None):
                    votes = row[start:end]
                    if not any(votes):
                        topcount = 0
                        top = None
                    else:
                        topcount = max(votes)
                        topindex = row.index(topcount, *(start, end) if end else (start,))
                        top = fieldnames[topindex]
                    return top, topcount

                topbullet, topbulletcount = calculate_tops(bulletindex, doubleindex)
                topdouble, topdoublecount = calculate_tops(doubleindex)

                # Output each division's row as it's claculated.
                outrow = ([ward, division, warddiv, row[0]] +
                          [topbullet, topbulletcount] +
                          [topdouble, topdoublecount] + row[1:])
                writer.writerow(outrow)

                feature = {'type': 'Feature',
                           'properties': dict(zip(outfields, outrow)),
                           'geometry': divisions[warddiv]['geometry']}
                data['features'].append(feature)

            # Save the geojson file
            with open(outjsonfilename, 'w') as jsonfile:
                json.dump(data, jsonfile)


if __name__ == '__main__':
    process_csvs()
