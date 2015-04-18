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
        stats: null,
        sort: {desc: true, lastKey: null},
      };
    },
    methods: {
      sortRows: function(e) {
        sortRows.call(this, e);
      },
    }
  });

  Vue.component('pitching-stats-component', {
    template: '#pitching-stats-template',
    data: function() {
      return {
        stats: null,
        sort: {desc: true, lastKey: null},
      };
    },
    methods: {
      sortRows: function(e) {
        sortRows.call(this, e);
      },
    }
  });


  // ------------------------------------------------------------
  // DOMContentLoaded
  // ------------------------------------------------------------

  window.addEventListener('DOMContentLoaded', function() {

    var app = new Vue({
      el: '#app',
      data: {
        loaded: false,
        batting: {},
        pitching: {},
      },
      created: function() {
        var url = '//' + location.host + '/api/stats/both?year=2015';
        utils.getJSON(url).then(function(json) {
          this.$data.batting = json.batting;
          this.$data.pitching = json.pitching;
          this.$data.loaded = true;
        }.bind(this)).catch(function(err) {
          console.error(err);
        });
      },
    });
    
  });


  // ------------------------------------------------------------
  // helpers
  // ------------------------------------------------------------

  function sortRows(e) {
    var key = e.target.dataset.key;
    this.$data.sort.desc = this.$data.sort.lastKey === key ?
      !this.$data.sort.desc : this.$data.sort.desc;
    this.$data.sort.lastKey = key;
    utils.sortObjsByKey(key, this.$data.stats, this.$data.sort.desc);

    var elems = this.$el.getElementsByClassName('sorted');
    Array.prototype.forEach.call(elems, function(elem) {
      elem.classList.remove('sorted');
      elem.classList.remove('desc');
      elem.classList.remove('asc');
    });
    
    e.target.classList.add('sorted');
    e.target.classList.add(this.$data.sort.desc ? 'desc' : 'asc');
  }
  
})((this || 0).self || global);
