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

  NS.setWardCandidatesHeader = function(tcontext) {
    var tpl = document.getElementById('ward-candidates-header-tpl').innerHTML;
    var output = Mustache.render(tpl, tcontext);
    document.getElementById('ward-candidates-header').innerHTML = output;
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
        // or
        //width: 100 // this makes bar width 100px
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
        hide: true
      }
    });
  };

  NS.initWardCandidatesChart = function() {
    NS.wardCandidatesChart = c3.generate({
      bindto: '#ward-candidates-chart-wrapper',
      data: {
        type: 'donut',
        columns: BulletVotes.bulletFieldNames.map(function(fieldname) {
          return [fieldname, 0];
        }).concat([['other', 0]]),
        names: BulletVotes.bulletFieldLabels,
        order: null
      },
      donut: {
        label: {
          show: false
        }
      },
      tooltip: {
        format: {
          value: function (value, ratio, id, index) { return value + ' votes (' + d3.format('%')(ratio) + ')'; }
        }
      }
    });
  };

  NS.updateWardVotesChart = function(values) {
    NS.wardVotesChart.load({
      columns: [
        ['Number of Voters'].concat(values)
      ]
    });
  };

  NS.updateWardCandidatesChart = function(values) {
    var sorted = _(values).sortBy(1).reverse();
    var highest5 = sorted.slice(0, 5);
    var lowest = sorted.slice(5);
    var other = lowest.reduce(function(s, v) { return ['other', s[1] + v[1]]; });

    NS.wardCandidatesChart.legend.hide(_(lowest).pluck(0));
    NS.wardCandidatesChart.legend.show(_(highest5).pluck(0));
    NS.wardCandidatesChart.legend.show('other');

    NS.wardCandidatesChart.load({
      columns: highest5.concat([other]).concat(lowest.map(function(v) { return [v[0], 0]; }))
    });
  };

  function main() {
    // NOTE: This is not ideal, but for now we will hard-code the candidate
    // single and pair values.
    BulletVotes.bulletFieldNames = [
      'neilson', 'rizzo', 'wyatt', 'gym', 'domb', 'green', 'steinke',
      'reynolds_brown', 'goode', 'aument_loughrey', 'cohen', 'alexander',
      'thomas', 'greenlee', 'cain', 'ayers', 'write_in'
    ];
    BulletVotes.bulletFieldLabels = {
      'neilson': 'Neilson', 'rizzo': 'Rizzo', 'wyatt': 'Wyatt', 'gym': 'Gym',
      'domb': 'Domb', 'green': 'Green', 'steinke': 'Steinke',
      'reynolds_brown': 'Reynolds Brown', 'goode': 'Goode',
      'aument_loughrey': 'Aument-Loughrey', 'cohen': 'Cohen',
      'alexander': 'Alexander', 'thomas': 'Thomas', 'greenlee': 'Greenlee',
      'cain': 'Cain', 'ayers': 'Ayers', 'write_in': 'Write in', 'other': 'Other'
    };

    BulletVotes.initWardVotesChart();
    BulletVotes.initWardCandidatesChart();

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
    .done(function(vis, layers  ) {
      // layer 0 is the base layer, layer 1 is cartodb layer
      // setInteraction is disabled by default
      layers[1].setInteraction(true);
      layers[1].on('featureClick', function(e, pos, latlng, data) {
        cartodb.log.log(e, pos, latlng, data);

        var sql = new cartodb.SQL({ user: 'mjumbewu' });
        sql.execute("SELECT * FROM political_wards_merge WHERE cartodb_id = {{cartodb_id}}", data)
          .done(function(data) {
            var d = data.rows[0];

            BulletVotes.setWardVotesHeader(d);
            BulletVotes.setWardCandidatesHeader(d);
            BulletVotes.setDivisionVotesHeader(d);
            BulletVotes.setDivisionCandidatesHeader(d);

            BulletVotes.updateWardVotesChart([
              d['_0_votes'], d['_1_votes'], d['_2_votes'],
              d['_3_votes'], d['_4_votes'], d['_5_votes']
            ]);
            BulletVotes.updateWardCandidatesChart(
              BulletVotes.bulletFieldNames.map(function(fieldname) {
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

})(BulletVotes);