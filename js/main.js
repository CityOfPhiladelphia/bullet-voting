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
      axis: {
        x: {
          label: {
            text: 'Number of Candidates Chosen',
            position: 'outer-middle'
          }
        },
        y: {
          label: {
            text: 'Number of Voters',
            position: 'outer-middle'
          }
        }
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
        })
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
    NS.wardCandidatesChart.load({
      columns: values
    });
  };

  function main() {
    BulletVotes.bulletFieldNames = [
      'neilson', 'rizzo', 'wyatt', 'gym', 'domb', 'green', 'steinke',
      'reynolds_brown', 'goode', 'aument_loughrey', 'cohen', 'alexander',
      'thomas', 'greenlee', 'cain', 'ayers', 'write_in'
    ];

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