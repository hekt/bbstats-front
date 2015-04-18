(function(global) {
  'use strict';

  var utils = global.utils;


  // ------------------------------------------------------------
  // Vue
  // ------------------------------------------------------------

  Vue.component('player-batting-component', {
    template: '#player-batting-template',
    data: function() {
      return {
        stats: null,
        results: null,
      };
    },
    created: function() {
      // Vue.nextTick(this.drawGraph);
    },
    methods: {
      drawGraph: function() {
        var data = this.$data.player.results;
        var func = function(x) {
          return x.rbi;
        };
        var history = utils.graph.buildHistory(data, ['rbi'], func);
        var elem = document.getElementById('avg-graph');
        var rect = elem.getBoundingClientRect();
        elem.style.height = (rect.width / 12 * 3) + 'px';
        elem.style.margin = '2rem 0';

        utils.graph.draw(elem, history);
      },
    },
  });

  Vue.component('player-pitching-component', {
    template: '#player-pitching-template',
    data: function() {
      return {
        stats: null,
      };
    },
  });


  // ------------------------------------------------------------
  // DOMContentLoaded
  // ------------------------------------------------------------

  window.addEventListener('DOMContentLoaded', function() {
    var app = new Vue({
      el: '#app',
      data: {
        player: {},
        loaded: false,
        hasBattingStats: false,
        hasPitchingStats: false,
      },
      created: function() {
        var playerId = utils.getPlayerIdFromUrl();
        var url = '//' + location.host + '/api/player/stats?' +
              'playerId=' + playerId + '&year=2015';
        utils.getJSON(url).then(function(json) {
          console.log(json);
          this.$data.hasBattingStats =
            Object.keys(json.batting.results).length > 0;
          this.$data.hasPitchingStats =
            Object.keys(json.pitching.results).length > 0;
          this.$data.player = {
            playerName: json.playerName,
            playerId: json.playerId,
            batting: {
              mostAtbats: utils.calcMostAtbatsOnPlayer(json.batting.results),
              results: json.batting.results,
              stats: json.batting.stats,
            },
            pitching: {
              results: json.pitching.results,
              stats: json.pitching.stats,
            }
          };
          this.$data.loaded = true;
        }.bind(this)).catch(function(err) {
          console.error(err);
        });
      },
    });
  });


  // ------------------------------------------------------------
  // Mocks
  // ------------------------------------------------------------

  utils.getPlayerIdFromUrlMock = function(num) {
    return num;
  };

})((this || 0).self || global);
