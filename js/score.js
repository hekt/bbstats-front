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
        notes: null,
      };
    },
    created: function() {
      this.$on('scroll', function(time) {
        var myTime = (new Date(this.$data.score.date)).getTime();
        if (time === myTime) {
          var elem = this.$el;
          var rect = elem.getBoundingClientRect();
          this.toggleDetail();
          this.loadDetails().then(function() {
            window.scrollTo(rect.left, rect.top);
          });
        }
        // Vue.nextTick(this.onClickBlockLink); // debug
      });
    },
    methods: {
      toggleDetail: function() {
        this.$data.detailExpanded = !this.$data.detailExpanded;
        this.$data.expandText = this.$data.detailExpanded ?
          CONTRUCT_DETAILS_TEXT : EXPAND_DETAILS_TEXT;
      },
      loadDetails: function() {
        var date = this.$data.score.date;
        var url = '//' + location.host + '/api/stats?date=' + date;
        this.$data.detailLoading = true;
        return utils.getJSON(url).then(function(json) {
          var mostAtbats = utils.calcMostAtbats(json.batting);
          this.$data.battingResults = {
            players: utils.formatBattingStats(json.batting),
            mostAtbats: new Array(mostAtbats),
          };
          this.$data.pitchingResults = {
            players: json.pitching,
          };
          
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
        url = '//' + location.host + '/api/score?year=2015';
        utils.getJSON(url).then(function(json) {
          this.$data.scores = json.map(function(score) {
            return {score: score};
          });
            // .slice(0, 1); // debug
          var match = location.pathname.match(/\/score\/(\d{4}-\d{2}-\d{2})/);
          if (match)
            var time = (new Date(match[1])).getTime();
            var f = this.$broadcast.bind(this, 'scroll', time);
            Vue.nextTick(f);
        }.bind(this)).catch(function(err) {
          console.error(err);
        });
      },
    });
  });

})((this || 0).self || global);
