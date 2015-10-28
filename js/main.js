var BulletVotes = BulletVotes || {};

(function(NS) {

  NS.showIntro = function() {
    document.getElementById('intro').classList.remove('hide');
  };

  NS.hideIntro = function() {
    document.getElementById('intro').classList.add('hide');
  };

  NS.showStats = function() {
    document.getElementById('stats').classList.remove('hide');
  };

  NS.hideStats = function() {
    document.getElementById('stats').classList.add('hide');
  };

  NS.setWardVotesHeader = function(tcontext) {
    var tpl = document.getElementById('ward-votes-header-tpl').innerHTML;
    var output = Mustache.render(tpl, tcontext);
    document.getElementById('ward-votes-header').innerHTML = output;
  };

  NS.setWardBulletsHeader = function(tcontext) {
    var tpl = document.getElementById('ward-bullets-header-tpl').innerHTML;
    var output = Mustache.render(tpl, tcontext);
    document.getElementById('ward-bullets-header').innerHTML = output;
  };

  NS.setDivisionVotesHeader = function(tcontext) {
    var tpl = document.getElementById('division-votes-header-tpl').innerHTML;
    var output = Mustache.render(tpl, tcontext);
    document.getElementById('division-votes-header').innerHTML = output;
  };

  NS.setDivisionCandidatesHeader = function(tcontext) {
    var tpl = document.getElementById('division-candidates-header-tpl').innerHTML;
    var output = Mustache.render(tpl, tcontext);
    document.getElementById('division-candidates-header').innerHTML = output;
  };

  var ybinterp = d3.interpolateRgb('#F2BA13', '#027EA4');
  var grayinterp = d3.interpolateRgb('#353535', '#9299A5');

  // Populate the candiadate name colors that aren't explicitly set with values
  // between the alpha.phila.gov yellow and blue.
  NS._fillInNameColors = function() {
    NS.bulletFieldColors = NS.bulletFieldColors || {};
    var unsetNames = _(NS.bulletFieldNames).filter(function(fieldname) { return !NS.bulletFieldColors[fieldname]; })
    var factor = 0;
    var step = 1.0 / (unsetNames.length - 1);
    unsetNames.forEach(function(name) {
      NS.bulletFieldColors[name] = grayinterp(factor);
      factor += step;
    });
  };
  NS._fillInPairColors = function() {
    NS.pairFieldColors = NS.pairFieldColors || {};
    var unsetNames = _(NS.pairFieldNames).filter(function(fieldname) { return !NS.pairFieldColors[fieldname]; })
    var huefactor = 0;
    var huestep = 360.0 / (unsetNames.length - 1);
    _(unsetNames).shuffle().forEach(function(name) {
      NS.pairFieldColors[name] = d3.hsl(huefactor, 1, 0.375);
      huefactor += huestep;
    });
  };

  NS.initWardVotesChart = function() {
    NS.wardVotesChart = c3.generate({
      bindto: '#ward-votes-chart-wrapper',
      data: {
        columns: [
          ['Number of Voters', 0, 0, 0, 0, 0, 0]
        ],
        type: 'bar',
        color: function(color, d, undefined) {
          var colorMap = {
            0: '#f7f7f7',
            1: ybinterp(0),
            2: '#353535',//ybinterp(0.4),
            3: '#666',//ybinterp(0.5),
            4: '#9299A5',//ybinterp(0.6),
            5: ybinterp(1)
          };

          if (d.index !== undefined) { return colorMap[d.index]; }
          else { return color; }
        }
      },
      bar: {
        width: {
          ratio: 0.85 // this makes bar width 50% of length between ticks
        }
      },
      size: {
        height: 200
      },
      axis: {
        x: {
          label: {
            text: 'Number of Candidates Chosen',
            position: 'outer-center'
          }
        },
        y: {
          label: {
            text: 'Number of Voters',
            position: 'outer-middle'
          }
        }
      },
      tooltip: {
        format: {
          title: function(x) { return x + '&nbsp;candidate' + (x != 1 ? 's' : ''); }
        }
      },
      legend: {
        show: false,
        hide: true
      }
    });
  };

  NS.initDivisionVotesChart = function() {
    NS.divisionVotesChart = c3.generate({
      bindto: '#division-votes-chart-wrapper',
      data: {
        columns: [
          ['5 Chosen', 0],
          ['4 Chosen', 0],
          ['3 Chosen', 0],
          ['2 Chosen', 0],
          ['1 Chosen', 0],
          ['0 Chosen', 0]
        ],
        groups: [
          ['x',
            '0 Chosen', '1 Chosen', '2 Chosen',
            '3 Chosen', '4 Chosen', '5 Chosen'
          ],
        ],
        type: 'bar',
        order: function(data1, data2) {
          var num1 = data1.id[0];
          var num2 = data2.id[0];
          if (num1 === num2) { return 0; }
          if (num1 < num2) { return -1; }
          if (num1 > num2) { return 1; }
        },
        colors: {
          '0 Chosen': '#f7f7f7',
          '1 Chosen': ybinterp(0),
          '2 Chosen': '#353535',//ybinterp(0.4),
          '3 Chosen': '#666',//ybinterp(0.5),
          '4 Chosen': '#9299A5',//ybinterp(0.6),
          '5 Chosen': ybinterp(1)
        }
      },
      bar: {
        width: {
          ratio: 1.1 // this makes bar width 50% of length between ticks
        }
      },
      size: {
        height: 200
      },
      axis: {
        x: {
          label: {
            text: 'Division',
            position: 'outer-center'
          },
          tick: {
            rotate: 90,
            multiline: false
          },
          type: 'category'
        },
        y: {
          label: {
            text: 'Percentage of Voters',
            position: 'outer-middle'
          },
          tick: {
            format: d3.format('%')
          },
          max: 0.95,
          padding: 0
        }
      },
      tooltip: {
        format: {
          title: function(x) {
            return 'Division ' + BulletVotes.divisionVotesChart.categories()[x];
          },
          name: function(name, ratio, id, index) { return name[0] + ' candidate' + (name[0] != '1' ? 's' : ''); },
          value: function(value, ratio, id, index) {
            var div = BulletVotes.divisionVotesChart.categories()[index];
            return d3.format('%')(value) + ' (' + BulletVotes._divisionVotesLabelMap['Div ' + div + ', ' + id] + ')';
          }
        }
      },
      legend: {
        show: false,
        hide: true
      }
    });
  };

  NS.initWardBulletsChart = function() {
    NS.wardBulletsChart = c3.generate({
      bindto: '#ward-bullets-chart-wrapper',
      data: {
        type: 'donut',
        columns: BulletVotes.bulletFieldNames.map(function(fieldname) {
          return [fieldname, 0];
        })/*.concat([['other', 0]])*/,
        names: BulletVotes.bulletFieldLabels,
        colors: BulletVotes.bulletFieldColors,
        order: null
      },
      donut: {
        label: {
          show: false,
        },
        expand: false,
        title: 'Top 5 Bullets'
      },
      size: {
        height: 200
      },
      tooltip: {
        format: {
          value: function(value, ratio, id, index) { return value + ' votes'; }
        }
      },
      legend: {
        show: false,
        hide: true
      }
    });

    NS.bulletFieldColors = NS.wardBulletsChart.data.colors();
  };

  NS.initWardPairsChart = function() {
    NS.wardPairsChart = c3.generate({
      bindto: '#ward-pairs-chart-wrapper',
      data: {
        type: 'donut',
        columns: BulletVotes.pairFieldNames.map(function(fieldname) {
          return [fieldname, 0];
        })/*.concat([['other', 0]])*/,
        names: BulletVotes.pairFieldLabels,
        colors: BulletVotes.pairFieldColors,
        order: null
      },
      donut: {
        label: {
          show: false
        },
        expand: false,
        title: 'Top 5 Pairs'
      },
      size: {
        height: 200
      },
      tooltip: {
        format: {
          value: function(value, ratio, id, index) { return value + ' votes'; }
        }
      },
      legend: {
        show: false,
        hide: true
      }
    });

    NS.pairFieldColors = NS.wardPairsChart.data.colors();
  };

  NS.initDivisionCandidatesTable = function() {
    // Nothing to do here for now.
  };

  NS.updateWardVotesChart = function(values) {
    NS.wardVotesChart.load({
      columns: [
        ['Number of Voters'].concat(values)
      ]
    });
  };

  NS.updateDivisionVotesChart = function(data) {
    var values = [[
      '0 Chosen', '1 Chosen', '2 Chosen',
      '3 Chosen', '4 Chosen', '5 Chosen'
    ]];
    var divisions = _(data.rows).pluck('division');

    BulletVotes._divisionVotesLabelMap = {};

    data.rows.forEach(function(row) {
      // Get the total amount of bullet voting for each division
      var div = row['division'];
      var rowTotal = 1 * (row['_0_votes'] || 0) +
                     1 * (row['_1_votes'] || 0) +
                     1 * (row['_2_votes'] || 0) +
                     1 * (row['_3_votes'] || 0) +
                     1 * (row['_4_votes'] || 0) +
                     1 * (row['_5_votes'] || 0);

      // Float conversion
      rowTotal *= 1.0;

      // Collect the scaled values of each division's bullet vote counts
      values.push([
        (row['_0_votes'] || 0) / rowTotal,
        (row['_1_votes'] || 0) / rowTotal,
        (row['_2_votes'] || 0) / rowTotal,
        (row['_3_votes'] || 0) / rowTotal,
        (row['_4_votes'] || 0) / rowTotal,
        (row['_5_votes'] || 0) / rowTotal,
      ]);

      // Also build a maping for the tooltips, since at hover time, all C3 has
      // access to is the percentages.
      BulletVotes._divisionVotesLabelMap['Div ' + div + ', 0 Chosen'] = (row['_0_votes'] || 0) + ' votes';
      BulletVotes._divisionVotesLabelMap['Div ' + div + ', 1 Chosen'] = (row['_1_votes'] || 0) + ' votes';
      BulletVotes._divisionVotesLabelMap['Div ' + div + ', 2 Chosen'] = (row['_2_votes'] || 0) + ' votes';
      BulletVotes._divisionVotesLabelMap['Div ' + div + ', 3 Chosen'] = (row['_3_votes'] || 0) + ' votes';
      BulletVotes._divisionVotesLabelMap['Div ' + div + ', 4 Chosen'] = (row['_4_votes'] || 0) + ' votes';
      BulletVotes._divisionVotesLabelMap['Div ' + div + ', 5 Chosen'] = (row['_5_votes'] || 0) + ' votes';
    });

    NS.divisionVotesChart.load({
      rows: values,
      categories: divisions
    });
  };

  NS.updateWardBulletsLegend = function(highest, lowest) {
    var tpl = document.getElementById('ward-bullets-legend-tpl').innerHTML;
    var output = Mustache.render(tpl, {
      'labels': highest.map(function(v) {
        var fieldname = v[0];
        var text = NS.bulletFieldLabels[fieldname];
        var color = NS.bulletFieldColors[fieldname];
        return {'text': text, 'color': color};
      })
    });
    document.getElementById('ward-bullets-legend').innerHTML = output;
  };

  NS.updateWardBulletsChart = function(values) {
    // Make sure all the vote count values at least have zeros.
    values.map(function(v) { v[1] = (!!v[1] ? v[1] : 0); });

    // Sort the values. The highest 5 values will be displayed. The remaining
    // values will be collected into an 'other' category.
    var sorted = _(values).sortBy(1).reverse();
    var highest = sorted.slice(0, 5);
    var lowest = sorted.slice(5).concat(_(highest).where({1: 0}));
    var other = lowest.reduce(function(s, v) { return ['other', s[1] + v[1]]; });

    highest = _(highest).filter(function(v) { return !!v[1]; });

    NS.updateWardBulletsLegend(highest, lowest);

    NS.wardBulletsChart.load({
      columns: highest./*concat([other]).*/concat(lowest.map(function(v) { return [v[0], 0]; }))
    });
  };

  NS.updateWardPairsLegend = function(highest, lowest) {
    var tpl = document.getElementById('ward-pairs-legend-tpl').innerHTML;
    var output = Mustache.render(tpl, {
      'labels': highest.map(function(v) {
        var fieldname = v[0];
        var text = NS.pairFieldLabels[fieldname];
        var color = NS.pairFieldColors[fieldname];
        return {'text': text, 'color': color};
      })
    });
    document.getElementById('ward-pairs-legend').innerHTML = output;
  };

  NS.updateWardPairsChart = function(values) {
    // Make sure all the vote count values at least have zeros.
    values.map(function(v) { v[1] = (!!v[1] ? v[1] : 0); });

    // Sort the values. The highest 5 values will be displayed. The remaining
    // values will be collected into an 'other' category.
    var sorted = _(values).sortBy(1).reverse();
    var highest = sorted.slice(0, 5);
    var lowest = sorted.slice(5).concat(_(highest).where({1: 0}));
    var other = lowest.reduce(function(s, v) { return ['other', s[1] + v[1]]; });

    highest = _(highest).filter(function(v) { return !!v[1]; });

    NS.updateWardPairsLegend(highest, lowest);

    NS.wardPairsChart.load({
      columns: highest./*concat([other]).*/concat(lowest.map(function(v) { return [v[0], 0]; }))
    });
  };

  NS.updateDivisionCandidatesTable = function(data) {
    var tpl, output;

    data.rows.forEach(function(row) {
      row.bullets = [];
      row.pairs = [];

      NS.bulletFieldNames.forEach(function(fieldname) {
        var votecount = row[fieldname] * 1;
        if (votecount) {
          row.bullets.push({label: NS.bulletFieldLabels[fieldname], count: votecount});
        }
      });

      NS.pairFieldNames.forEach(function(fieldname) {
        var votecount = row[fieldname] * 1;
        if (votecount) {
          row.pairs.push({label: NS.pairFieldLabels[fieldname], count: votecount});
        }
      });

      row.bullets = _(row.bullets).sortBy('count').reverse();
      row.pairs = _(row.pairs).sortBy('count').reverse();
    });

    tpl = document.getElementById('division-candidates-table-tpl').innerHTML;
    output = Mustache.render(tpl, data);
    document.getElementById('division-candidates-table-wrapper').innerHTML = output;
  };

  NS.getWardTitle = function(ward) {
    return 'Ward ' + ward;
  };

  NS.isChartsInitialized = false;
  NS.goToWard = function(ward) {
    var sql;
    var _ensureStatsShown = function() {
      BulletVotes.hideIntro();
      BulletVotes.showStats();

      // We don't want to initialize the charts until after the stats
      // container is visible, because the charts need the size of the
      // container to be calculated.
      //
      // TODO: Think about doing this off-screen so that we don't have to
      // actually show the stats section before it's all ready.
      if (!NS.isChartsInitialized) {
        NS.isChartsInitialized = true;
        NS.initWardVotesChart();
        NS.initDivisionVotesChart();
        NS.initWardBulletsChart();
        NS.initWardPairsChart();
        NS.initDivisionCandidatesTable();
      }
    };

    if (canPushState() && window.location.hash != ('#/' + ward)) {
      window.history.pushState(null, NS.getWardTitle(ward), '#/' + ward);
    }

    BulletVotes.setWardVotesHeader({'ward_display': ward});
    BulletVotes.setWardBulletsHeader({'ward_display': ward});
    BulletVotes.setDivisionVotesHeader({'ward_display': ward});
    BulletVotes.setDivisionCandidatesHeader({'ward_display': ward});

    // Fetch from the ward data table and update charts.
    sql = new cartodb.SQL({ user: 'mjumbewu' });
    sql.execute("SELECT * FROM " + BulletVotes.wardsTable + " WHERE ward = '{{ward}}' LIMIT 1", {'ward': ward})
      .done(function(data) {
        var d = data.rows[0];
        _ensureStatsShown();

        BulletVotes.updateWardVotesChart([
          d['_0_votes'], d['_1_votes'], d['_2_votes'],
          d['_3_votes'], d['_4_votes'], d['_5_votes']
        ]);
        BulletVotes.updateWardBulletsChart(
          _(BulletVotes.bulletFieldNames).without('other').map(function(fieldname) {
            return [fieldname, d[fieldname]];
          })
        );
        BulletVotes.updateWardPairsChart(
          _(BulletVotes.pairFieldNames).without('other').map(function(fieldname) {
            return [fieldname, d[fieldname]];
          })
        );

        console.log(data.rows);
      })
      .error(function(errors) {
        // errors contains a list of errors
        console.log("errors:" + errors);
      });

    // Fetch from the divisions data table and update charts.
    sql.execute("SELECT * FROM " + BulletVotes.divisionsTable + " WHERE ward = '{{ward}}'", {'ward': ward})
      .done(function(data) {
        _ensureStatsShown();

        // Both the table and the stacked bar chart expect the rows to be
        // sorted, so just do it here.
        data.rows = _(data.rows).sortBy('warddiv');

        BulletVotes.updateDivisionVotesChart(data);
        BulletVotes.updateDivisionCandidatesTable(data);
      })
      .error(function(errors) {
        // errors contains a list of errors
        console.log("errors:" + errors);
      });
  };

  NS.closeWardStats = function() {
    BulletVotes.showIntro();
    BulletVotes.hideStats();
  };

  NS.wardHashPattern = /^#\/(\d+)$/;
  NS.divisionHashPattern = /^#\/(\d+)\/(\d+)$/;

  NS.handleHashChange = function() {
    var hash = window.location.hash;
    var match;

    if (!hash) {
      NS.closeWardStats();
      return;
    }

    match = NS.wardHashPattern.exec(hash);
    if (match) {
      NS.goToWard(match[1]);
      return;
    }
  };

  NS.createMap = function(callback) {
    // add link to CartoDB viz.json here
    cartodb.createVis('map', BulletVotes.cartodbURL, {
        shareable: false ,
        title: false,
        description: false,
        search: true,
        tiles_loader: true,
        center_lat: 39.9894197,
        center_lon: -75.1214633,
        zoom: 11,
        cartodb_logo: false
    })
    .done(function(vis, layers) {
      NS.map = vis.getNativeMap();
      callback(vis, layers);
    })
    .error(function(err) {
      console.log(err);
    });
  };

})(BulletVotes);


function canPushState() {
  return (window.history && window.history.pushState && window.history.replaceState ? true : false);
}

function main() {
  if (!BulletVotes.cartodbURL) {
    throw "Configuration Error: No cartodb URL has been set. Please set the BulletVotes.cartodbURL to the api URL for the map. Thanks!";
  }

  if (!BulletVotes.wardsTable) {
    throw "Configuration Error: No wards table name has been set. Please set the BulletVotes.wardsTable. Thanks!";
  }

  if (!BulletVotes.divisionsTable) {
    throw "Configuration Error: No divisions table name has been set. Please set the BulletVotes.divisionsTable. Thanks!";
  }

  BulletVotes._fillInNameColors();
  BulletVotes._fillInPairColors();

  BulletVotes.createMap(
    function(vis, layers) {

    // layer 0 is the base layer, layer 1 is cartodb layer
    // setInteraction is disabled by default
    layers[1].setInteraction(true);

    // NOTE: In this case the cartodb layer has two sub layers. We want the
    // first one (the district layer) to be interactive, but not the second
    // (the ward layer).
    layers[1].layers[1].sub.setInteraction(false);

    layers[1].on('featureClick', function(e, pos, latlng, data) {
      cartodb.log.log(e, pos, latlng, data);
      BulletVotes.goToWard(data.ward);
    });

    // you can get the native map to work with it
    // depending if you use google maps or leaflet
    map = vis.getNativeMap();
    // now, perform any operations you need
    // map.setZoom(3)
    // map.setCenter(new google.maps.Latlng(...))
    map.doubleClickZoom.disable();

    BulletVotes.handleHashChange();
    if (canPushState()) {
      window.onpopstate = BulletVotes.handleHashChange;
    }
  });
}

window.onload = main;

