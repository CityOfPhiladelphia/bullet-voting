var BulletVotes = BulletVotes || {};

(function(NS) {

  NS.hideIntro = function() {
    document.getElementById('intro').classList.add('hide');
  };

  NS.showStats = function() {
    document.getElementById('stats').classList.remove('hide');
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

  // NOTE: Hard-coding these cadidate values is not ideal, but is easiest for
  // now.
  NS.bulletFieldNames = [
    'neilson', 'rizzo', 'wyatt', 'gym', 'domb', 'green', 'steinke',
    'reynolds_brown', 'goode', 'aument_loughrey', 'cohen', 'alexander',
    'thomas', 'greenlee', 'cain', 'ayers', 'write_in', 'other'
  ];
  NS.bulletFieldLabels = _.object(NS.bulletFieldNames, [
    'Neilson', 'Rizzo', 'Wyatt', 'Gym', 'Domb', 'Green', 'Steinke',
    'Reynolds Brown', 'Goode', 'Aument-Loughrey', 'Cohen', 'Alexander',
    'Thomas', 'Greenlee', 'Cain', 'Ayers', 'Write in', 'Other'
  ]);

  NS.pairFieldNames = [
    'wyatt_neilson', 'green_greenlee', 'green_domb', 'domb_rizzo', 'greenlee_neilson', 'neilson_rizzo', 'domb_gym', 'wyatt_greenlee', 'greenlee_gym', 'wyatt_cohen', 'green_rizzo', 'steinke_rizzo', 'steinke_goode', 'domb_steinke', 'green_wyatt', 'cohen_gym', 'reynolds_brown_neilson', 'cohen_thomas', 'wyatt_rizzo', 'domb_neilson', 'wyatt_gym', 'domb_wyatt',
    'gym_thomas', 'reynolds_brown_steinke', 'wyatt_steinke', 'green_gym', 'steinke_gym', 'ayers_gym', 'domb_reynolds_brown', 'green_aument_loughrey', 'reynolds_brown_cohen', 'gym_neilson', 'green_neilson', 'neilson_goode', 'domb_aument_loughrey', 'steinke_neilson', 'green_ayers', 'aument_loughrey_gym', 'green_goode', 'steinke_cohen', 'reynolds_brown_goode', 'cohen_neilson', 'rizzo_goode', 'gym_goode',
    'thomas_goode', 'greenlee_rizzo', 'domb_greenlee', 'ayers_reynolds_brown', 'reynolds_brown_gym', 'ayers_aument_loughrey', 'reynolds_brown_thomas', 'wyatt_reynolds_brown', 'green_cohen', 'aument_loughrey_greenlee', 'cohen_cain', 'gym_rizzo', 'ayers_wyatt', 'alexander_cain', 'ayers_domb', 'reynolds_brown_rizzo', 'cain_aument_loughrey', 'reynolds_brown_greenlee', 'greenlee_goode', 'cain_reynolds_brown', 'ayers_cain', 'ayers_steinke',
    'green_thomas', 'aument_loughrey_rizzo', 'cohen_goode', 'green_cain', 'cohen_rizzo', 'domb_cohen', 'neilson_thomas', 'domb_thomas', 'wyatt_thomas', 'cain_gym', 'cain_rizzo', 'ayers_cohen', 'alexander_thomas', 'rizzo_thomas', 'ayers_alexander', 'cohen_greenlee', 'steinke_greenlee', 'cain_thomas', 'alexander_rizzo', 'reynolds_brown_aument_loughrey', 'cain_goode', 'aument_loughrey_neilson',
    'alexander_gym', 'steinke_aument_loughrey', 'cain_steinke', 'alexander_wyatt', 'aument_loughrey_thomas', 'greenlee_thomas', 'ayers_thomas', 'alexander_neilson', 'alexander_cohen', 'ayers_neilson', 'aument_loughrey_cohen', 'domb_cain', 'wyatt_goode', 'cain_greenlee', 'wyatt_cain', 'alexander_goode', 'alexander_reynolds_brown', 'ayers_goode', 'reynolds_brown_green', 'gym_write_in', 'ayers_greenlee', 'cain_cohen',
    'alexander_steinke', 'wyatt_aument_loughrey', 'cain_neilson', 'rizzo_write_in', 'alexander_greenlee', 'alexander_aument_loughrey', 'thomas_write_in', 'green_reynolds_brown', 'green_alexander', 'green_steinke', 'ayers_rizzo', 'alexander_domb', 'domb_goode', 'steinke_thomas', 'aument_loughrey_goode', 'alexander_write_in',
    'other'
  ];
  NS.pairFieldLabels = _.object(NS.pairFieldNames, [
    'Wyatt & Neilson', 'Green & Greenlee', 'Green & Domb', 'Domb & Rizzo', 'Greenlee & Neilson', 'Neilson & Rizzo', 'Domb & Gym', 'Wyatt & Greenlee', 'Greenlee & Gym', 'Wyatt & Cohen', 'Green & Rizzo', 'Steinke & Rizzo', 'Steinke & Goode', 'Domb & Steinke', 'Green & Wyatt', 'Cohen & Gym', 'Reynolds-Brown & Neilson', 'Cohen & Thomas', 'Wyatt & Rizzo', 'Domb & Neilson', 'Wyatt & Gym', 'Domb & Wyatt',
    'Gym & Thomas', 'Reynolds-Brown & Steinke', 'Wyatt & Steinke', 'Green & Gym', 'Steinke & Gym', 'Ayers & Gym', 'Domb & Reynolds-Brown', 'Green & Aument-Loughrey', 'Reynolds-Brown & Cohen', 'Gym & Neilson', 'Green & Neilson', 'Neilson & Goode', 'Domb & Aument & Loughrey', 'Steinke & Neilson', 'Green & Ayers', 'Aument-Loughrey & Gym', 'Green & Goode', 'Steinke & Cohen', 'Reynolds-Brown & Goode', 'Cohen & Neilson', 'Rizzo & Goode', 'Gym & Goode',
    'Thomas & Goode', 'Greenlee & Rizzo', 'Domb & Greenlee', 'Ayers & Reynolds-Brown', 'Reynolds-Brown & Gym', 'Ayers & Aument-Loughrey', 'Reynolds-Brown & Thomas', 'Wyatt & Reynolds-Brown', 'Green & Cohen', 'Aument-Loughrey & Greenlee', 'Cohen & Cain', 'Gym & Rizzo', 'Ayers & Wyatt', 'Alexander & Cain', 'Ayers & Domb', 'Reynolds-Brown & Rizzo', 'Cain & Aument-Loughrey', 'Reynolds-Brown & Greenlee', 'Greenlee & Goode', 'Cain & Reynolds-Brown', 'Ayers & Cain', 'Ayers & Steinke',
    'Green & Thomas', 'Aument-Loughrey & Rizzo', 'Cohen & Goode', 'Green & Cain', 'Cohen & Rizzo', 'Domb & Cohen', 'Neilson & Thomas', 'Domb & Thomas', 'Wyatt & Thomas', 'Cain & Gym', 'Cain & Rizzo', 'Ayers & Cohen', 'Alexander & Thomas', 'Rizzo & Thomas', 'Ayers & Alexander', 'Cohen & Greenlee', 'Steinke & Greenlee', 'Cain & Thomas', 'Alexander & Rizzo', 'Reynolds-Brown & Aument-Loughrey', 'Cain & Goode', 'Aument-Loughrey & Neilson',
    'Alexander & Gym', 'Steinke & Aument-Loughrey', 'Cain & Steinke', 'Alexander & Wyatt', 'Aument-Loughrey & Thomas', 'Greenlee & Thomas', 'Ayers & Thomas', 'Alexander & Neilson', 'Alexander & Cohen', 'Ayers & Neilson', 'Aument-Loughrey & Cohen', 'Domb & Cain', 'Wyatt & Goode', 'Cain & Greenlee', 'Wyatt & Cain', 'Alexander & Goode', 'Alexander & Reynolds-Brown', 'Ayers & Goode', 'Reynolds-Brown & Green', 'Gym & Write-in', 'Ayers & Greenlee', 'Cain & Cohen',
    'Alexander & Steinke', 'Wyatt & Aument-Loughrey', 'Cain & Neilson', 'Rizzo & Write-in', 'Alexander & Greenlee', 'Alexander & Aument-Loughrey', 'Thomas/Write & In', 'Green & Reynolds-Brown', 'Green & Alexander', 'Green & Steinke', 'Ayers & Rizzo', 'Alexander & Domb', 'Domb & Goode', 'Steinke & Thomas', 'Aument-Loughrey & Goode', 'Alexander & Write-In',
    'Other'
  ]);

  NS.initWardVotesChart = function() {
    NS.wardVotesChart = c3.generate({
      bindto: '#ward-votes-chart-wrapper',
      data: {
        columns: [
          ['Number of Voters', 0, 0, 0, 0, 0, 0]
        ],
        type: 'bar'
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

  NS.initWardBulletsChart = function() {
    NS.wardBulletsChart = c3.generate({
      bindto: '#ward-bullets-chart-wrapper',
      data: {
        type: 'donut',
        columns: BulletVotes.bulletFieldNames.map(function(fieldname) {
          return [fieldname, 0];
        })/*.concat([['other', 0]])*/,
        names: BulletVotes.bulletFieldLabels,
        order: null
      },
      donut: {
        label: {
          show: false,
        },
        expand: false,
        title: 'Top 5 Bullet'
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
        order: null
      },
      donut: {
        label: {
          show: false
        },
        expand: false,
        title: 'Top 5 Pair'
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

  NS.updateWardVotesChart = function(values) {
    NS.wardVotesChart.load({
      columns: [
        ['Number of Voters'].concat(values)
      ]
    });
  };

  NS.updateWardBulletsLegend = function(highest, lowest) {
    // NS.wardBulletsChart.legend.hide(_(lowest).pluck(0));
    // NS.wardBulletsChart.legend.show(_(highest).pluck(0));
    // NS.wardBulletsChart.legend.show('other');
  };

  NS.updateWardBulletsChart = function(values) {
    // Sort the values. The highest 5 values will be displayed. The remaining
    // values will be collected into an 'other' category.
    var sorted = _(values).sortBy(1).reverse();
    var highest = sorted.slice(0, 5);
    var lowest = sorted.slice(5);
    var other = lowest.reduce(function(s, v) { return ['other', s[1] + v[1]]; });

    NS.updateWardBulletsLegend(highest, lowest);

    NS.wardBulletsChart.load({
      columns: highest./*concat([other]).*/concat(lowest.map(function(v) { return [v[0], 0]; }))
    });
  };

  NS.updateWardPairsLegend = function(highest, lowest) {
    // NS.wardPairsChart.legend.hide(_(lowest).pluck(0));
    // NS.wardPairsChart.legend.show(_(highest).pluck(0));
    // NS.wardPairsChart.legend.show('other');
  };

  NS.updateWardPairsChart = function(values) {
    // Sort the values. The highest 5 values will be displayed. The remaining
    // values will be collected into an 'other' category.
    var sorted = _(values).sortBy(1).reverse();
    var highest = sorted.slice(0, 5);
    var lowest = sorted.slice(5);
    var other = lowest.reduce(function(s, v) { return ['other', s[1] + v[1]]; });

    NS.updateWardPairsLegend(highest, lowest);

    NS.wardPairsChart.load({
      columns: highest./*concat([other]).*/concat(lowest.map(function(v) { return [v[0], 0]; }))
    });
  };

  NS.goToWard = function(ward) {
    var sql = new cartodb.SQL({ user: 'mjumbewu' });
    sql.execute("SELECT * FROM political_wards_merge WHERE ward = {{ward}}", {'ward': ward})
      .done(function(data) {
        var d = data.rows[0];

        BulletVotes.setWardVotesHeader(d);
        BulletVotes.setWardBulletsHeader(d);
        BulletVotes.setDivisionVotesHeader(d);
        BulletVotes.setDivisionCandidatesHeader(d);

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

        BulletVotes.hideIntro();
        BulletVotes.showStats();

        console.log(data.rows);
      })
      .error(function(errors) {
        // errors contains a list of errors
        console.log("errors:" + errors);
      });
  };
})(BulletVotes);


function canPushState() {
  return (window.history && window.history.pushState && window.history.replaceState ? true : false);
}

function main() {
  BulletVotes.initWardVotesChart();
  BulletVotes.initWardBulletsChart();
  BulletVotes.initWardPairsChart();

  // add link to CartoDB viz.json here
  cartodb.createVis('map', 'https://mjumbewu.cartodb.com/api/v2/viz/416a0320-757a-11e5-8ba1-0e3ff518bd15/viz.json', {
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
    // layer 0 is the base layer, layer 1 is cartodb layer
    // setInteraction is disabled by default
    layers[1].setInteraction(true);
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
  })
  .error(function(err) {
    console.log(err);
  });
}

window.onload = main;

