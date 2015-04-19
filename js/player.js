(function(global) {
  'use strict';

  var utils = global.utils;


  // ------------------------------------------------------------
  // Vue
  // ------------------------------------------------------------

  Vue.component('batting-stats-component', {
    template: '#batting-stats-template',
    data: function() {
      return {
        player: null,
      };
    },
  });

  Vue.component('batting-results-component', {
    template: '#batting-results-template',
    data: function() {
      return {
        player: null,
      };
    },
  });

  Vue.component('pitching-stats-component', {
    template: '#pitching-stats-template',
    data: function() {
      return {
        player: null,
      };
    },
  });

  Vue.component('pitching-results-component', {
    template: '#pitching-results-template',
    data: function() {
      return {
        player: null,
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
