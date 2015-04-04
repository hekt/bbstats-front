(function(global) {
  'use strict';

  // disable history back
  history.pushState(null, null, '');
  window.addEventListener('popstate', function(e) {
    history.pushState(null, null, '');
  });

  // ------------------------------------------------------------
  // Vue
  // ------------------------------------------------------------

  // configs
  
  // Vue.config.prefix = 'data-v-';

  // components

  var GeneralFormComponent = Vue.extend({
    template: '#general-form-template',
  });
  Vue.component('general-form-component', GeneralFormComponent);

  var ScoreFormComponent = Vue.extend({
    template: '#score-form-template',
    methods: {
      updateTotalRuns: function() {
        var data = this.$data.formData;
        data.homeTeam.totalRuns = runsSum(data.homeTeam.runs);
          Number(sum(data.homeTeam.runs.map(unwrapValue)));
        data.awayTeam.totalRuns =
          Number(sum(data.awayTeam.runs.map(unwrapValue)));
      },
      expandInnings: function() {
        var data = this.$data.formData;
        data.homeTeam.runs.push(wrapValue(0));
        data.awayTeam.runs.push(wrapValue(0));
        this.updateTotalRuns();
      },
      contractInnings: function() {
        var data = this.$data.formData;
        data.homeTeam.runs.pop();
        data.awayTeam.runs.pop();
        this.updateTotalRuns();
      }
    }
  });
  Vue.component('score-form-component', ScoreFormComponent);

  var BattingFormComponent = Vue.extend({
    template: '#batting-form-template',
    created: function() {
      Vue.nextTick(this.updateTabIndexes);
    },
    methods: {
      updateTabIndexes: function() {
        var tbody = document.getElementById('batting-form-table')
              .tBodies.item(0);
        addTabIndexes(tbody);
      },
      suggest: function(elem, e) {
        var data = this.$data.formData;
        var player = data.players[elem.$parent.$index];
        var atbat = player.atbats[elem.$index];
        atbat.resultKind = atbat.resultKind || suggestResultKind(atbat.result);
      },
      addRow: function(row, e) {
        var data = this.$data.formData;
        var i = row.$index;
        var order = data.players[i].order;
        var atbats = data.atbats.length;
        data.players.splice(i+1, 0, createBatter(order, atbats));
        Vue.nextTick(this.updateTabIndexes);
      },
      removeRow: function(row, e) {
        var i = row.$index;
        this.$data.formData.players.splice(i, 1);
        Vue.nextTick(this.updateTabIndexes);
      },
      expandAtbats: function(e) {
        var data = this.$data.formData;
        data.atbats.push(0);
        data.players.forEach(function(player) {
          player.atbats.push(createAtbat());
        });
        Vue.nextTick(this.updateTabIndexes);
      },
      contractAtbats: function(e) {
        var data = this.$data.formData;
        data.atbats.pop();
        data.players.forEach(function(player) {
          player.atbats.pop();
        });
        Vue.nextTick(this.updateTabindexes);
      }
    },
  });
  Vue.component('batting-form-component', BattingFormComponent);

  var PitchingFormComponent = Vue.extend({
    template: '#pitching-form-template',
    methods: {
      addRow: function(row, e) {
        var data = this.$data.formData;
        var i = row.$index;
        var order = data.players[i].order;
        data.players.splice(i+1, 0, createPitcher(order));
      },
      removeRow: function(row, e) {
        var i = row.$index;
        this.$data.formData.players.splice(i, 1);
      },
    },
  });
  Vue.component('pitching-form-component', PitchingFormComponent);


  // ------------------------------------------------------------
  // DOMContentLoaded
  // ------------------------------------------------------------

  window.addEventListener('DOMContentLoaded', function() {

    var app = new Vue({
      el: '#app',
      methods: {
        dump: function() {
          var general = this.$data.generalFormData;
          var batting = this.$data.battingFormData;
          var pitching = this.$data.pitchingFormData;
          
          var originalScore = this.$data.scoreFormData;
          var score = JSON.parse(JSON.stringify(originalScore));
          score.homeTeam.runs =
            score.homeTeam.runs.map(unwrapValue);
          score.awayTeam.runs =
            score.awayTeam.runs.map(unwrapValue);
          score.result = general.result;

          return {
            date: general.date,
            ground: general.ground,
            gameScore: score,
            battingStats: batting.players,
            pitchingStats: pitching.players,
          };
        },
        send: function() {
          var header = this.$data.generalFormData.user;
          var key = this.$data.generalFormData.key;
          var body = buildEncryptedRequest(key, this.dump());
          console.log(body);
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;
            console.log(xhr.status);
            console.log('success');
          };
          xhr.open('PUT', '//' + location.host + '/api/score');
          xhr.setRequestHeader('X-BBStats-Authenticated-User', header);
          xhr.send(body);
        }
      },
      data: {
        generalFormData: {
          user: '',
          key: '',
          date: null,
          ground: '',
          result: '',
        },
        scoreFormData: {
          homeTeam: {
            teamName: '',
            totalRuns: 0,
            totalHits: 0,
            totalErrors: 0,
            runs: [0,0,0,0,0,0,0].map(wrapValue),
          },
          awayTeam: {
            teamName: '',
            totalRuns: 0,
            totalHits: 0,
            totalErrors: 0,
            runs: [0,0,0,0,0,0,0].map(wrapValue),
          },
        },
        battingFormData: {
          atbats: [1,2,3],
          players: [1,2,3,4,5,6,7,8,9].map(function(n) {
            return createBatter(n, 3);
          }),
        },
        pitchingFormData: {
          players: [1,2].map(function(n) {
            return createPitcher(n);
          })
        }
      },
    });
    
    global.scoreDump = app.dump;
    global.scoreSend = app.send;
    global.app = app;

  });

  
  // ------------------------------------------------------------
  // Utils
  // ------------------------------------------------------------

  function buildEncryptedRequest(key, body) {
    var nonce = generateNonce(32);
    
    body.nonce = nonce;
    body.timestamp = new Date();

    var json = JSON.stringify(body);

    return global.CryptoJS.AES.encrypt(json, key).toString();
  }

  function generateNonce(len) {
    var chars = '0123456789' +
          'abcdefghijklmnopqrstuvwxyz' +
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var str = '';
    for (var i = 0, charsLen = chars.length; i < len; i++) {
      var j = Math.floor(Math.random() * charsLen);
      str += chars.charAt(j);
    }
    return str;
  }

  function suggestResultKind(result) {
    if (result.match(/^振逃$/)) return 'uts';
    if (result.match(/^[空見]?三振$/)) return 'so';
    if (result.match(/^四球$/)) return 'bb';
    if (result.match(/^死球$/)) return 'hbp';
    if (result.match(/安$/)) return 'h';
    if (result.match(/[2２]$/)) return 'dbl';
    if (result.match(/[3３]$/)) return 'tpl';
    if (result.match(/本$/)) return 'hr';
    if (result.match(/ゴ$/)) return 'go';
    if (result.match(/犠飛$/)) return 'sf';
    if (result.match(/[飛直]$/)) return 'fo';
    if (result.match(/併殺?$/)) return 'dp';
    if (result.match(/犠打?$/)) return 'sh';
    if (result.match(/失$/)) return 'e';
    return null;
  }

  function addTabIndexes(table) {
    var cellsList = Array.prototype.map.call(table.rows, function(row) {
      return row.cells;
    });

    var xLen = cellsList[0].length;
    var yLen = cellsList.length;
    var index = 0;
    for (var x = 0; x < xLen; x++) {
      for (var y = 0; y < yLen; y++) {
        Array.prototype.forEach.call(
          cellsList[y][x].getElementsByTagName('input'),
          function(input) { input.tabIndex = ++index; });
      }
    }
  }

  function createPitcher(order) {
    return {
      order: order,
      player: null,
      out: null,
      bf: null,
      run: null,
      erun: null,
      so: null,
      bb: null,
      h: null,
      hr: null,
      error: null,
      result: null,
    };
  }
  
  function createAtbat() {
    return {
      inning: null,
      rbi: null,
      runners: {first: false, second: false, third: false},
      outCount: null,
      result: null,
      resultKind: null,
    };
  }

  function createBatter(order, atbats) {
    var player = {
      order: order, 
      positions: null,
      name: null,
      run: null,
      sb: null,
      error: null,
      atbats: [],
    };
    
    for (var i = 0; i < atbats; i++) {
      player.atbats.push(createAtbat());
    }

    return player;
  }

  function runsSum(runs) {
    return sum(runs.map(function(obj) {
      return Math.max(obj.value, 0);
    }));
  }
  
  function sum(ns) {
    return ns.reduce(function(x, y) {
      return x + y;
    });
  }

  function toNumberObject(n) {
    return new Number(n);
  }

  function wrapValue(x) {
    return {value: x};
  }

  function unwrapValue(x) {
    return x.value;
  }
  
})((this || 0).self || global);
