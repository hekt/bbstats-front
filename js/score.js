(function(global) {
  'use strict';

  var utils = global.utils;

  // ------------------------------------------------------------
  // Constants
  // ------------------------------------------------------------

  var EXPAND_DETAILS_TEXT = '詳細を開く';
  var CONTRUCT_DETAILS_TEXT = '詳細を閉じる';
  

  // ------------------------------------------------------------
  // Vue
  // ------------------------------------------------------------

  Vue.component('score-component', {
    template: "#score-template",
    data: function() {
      return {
        detailLoading: false,
        detailLoaded: false,
        detailExpanded: false,
        expandText: EXPAND_DETAILS_TEXT,
        score: null,
        battingResults: null,
        pitchingResults: null,
      };
    },
    created: function() {
    },
    methods: {
      toggleDetail: function() {
        this.$data.detailExpanded = !this.$data.detailExpanded;
        this.$data.expandText = this.$data.detailExpanded ?
          CONTRUCT_DETAILS_TEXT : EXPAND_DETAILS_TEXT;
      },
      loadDetails: function() {
        var date = this.$data.score.date;
        var url = 'http://localhost:50260/api/stats?date=' + date;
        this.$data.detailLoading = true;
        return utils.getJSON(url).then(function(json) {
          var mostAtbats = utils.calcMostAtbats(json.batting.results);
          this.$data.battingResults = {
            players: utils.formatBattingStats(json.batting.results),
            mostAtbats: new Array(mostAtbats),
          };
          this.$data.pitchingResults = {
            players: json.pitching.results,
          };
          this.$data.notes = {};
          
          this.$data.detailLoaded = true;
          this.$data.detailLoading = false;
        }.bind(this));
      },
      onClickBlockLink: function(e) {
        this.toggleDetail();
        if (!this.$data.detailLoaded)
          this.loadDetails();
        e && e.preventDefault();
      }
    },
    components: {
      'table-score-component': {
        template: '#table-score-template',
        methods: {
          addX: function() {
            var data = this.$data.score;
            if (data.homeTeam.totalRuns > data.awayTeam.totalRuns) {
              var runs = data.homeTeam.runs.slice(0);
              var i = runs.length - 1;
              if (!runs[i]) return;
              runs[i] += '×';
              data.homeTeam.runs = runs;
            }
          }
        },
        created: function() {
          Vue.nextTick(this.addX.bind(this));
        }
      },
      'batting-results-component': { template: '#batting-results-template' },
      'pitching-results-component': { template: '#pitching-results-template' },
      'notes-component': { template: '#notes-template' },
    },
  });

  
  // ------------------------------------------------------------
  // DOMContentLoaded
  // ------------------------------------------------------------

  window.addEventListener('DOMContentLoaded', function() {
    var app = new Vue({
      el: '#app',
      data: {
        scores: [],
      },
      created: function() {
        var url;
        url = 'http://localhost:50260/api/score';
        utils.getJSON(url).then(function(json) {
          this.$data.scores = json.map(function(score) {
            return {score: score};
          });
        }.bind(this)).catch(function(err) {
          console.error(err);
        });
      },
    });
  });

})((this || 0).self || global);
