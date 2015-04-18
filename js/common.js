/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.0.0
 */

(function(){function r(a,b){n[l]=a;n[l+1]=b;l+=2;2===l&&A()}function s(a){return"function"===typeof a}function F(){return function(){process.nextTick(t)}}function G(){var a=0,b=new B(t),c=document.createTextNode("");b.observe(c,{characterData:!0});return function(){c.data=a=++a%2}}function H(){var a=new MessageChannel;a.port1.onmessage=t;return function(){a.port2.postMessage(0)}}function I(){return function(){setTimeout(t,1)}}function t(){for(var a=0;a<l;a+=2)(0,n[a])(n[a+1]),n[a]=void 0,n[a+1]=void 0;
l=0}function p(){}function J(a,b,c,d){try{a.call(b,c,d)}catch(e){return e}}function K(a,b,c){r(function(a){var e=!1,f=J(c,b,function(c){e||(e=!0,b!==c?q(a,c):m(a,c))},function(b){e||(e=!0,g(a,b))});!e&&f&&(e=!0,g(a,f))},a)}function L(a,b){1===b.a?m(a,b.b):2===a.a?g(a,b.b):u(b,void 0,function(b){q(a,b)},function(b){g(a,b)})}function q(a,b){if(a===b)g(a,new TypeError("You cannot resolve a promise with itself"));else if("function"===typeof b||"object"===typeof b&&null!==b)if(b.constructor===a.constructor)L(a,
b);else{var c;try{c=b.then}catch(d){v.error=d,c=v}c===v?g(a,v.error):void 0===c?m(a,b):s(c)?K(a,b,c):m(a,b)}else m(a,b)}function M(a){a.f&&a.f(a.b);x(a)}function m(a,b){void 0===a.a&&(a.b=b,a.a=1,0!==a.e.length&&r(x,a))}function g(a,b){void 0===a.a&&(a.a=2,a.b=b,r(M,a))}function u(a,b,c,d){var e=a.e,f=e.length;a.f=null;e[f]=b;e[f+1]=c;e[f+2]=d;0===f&&a.a&&r(x,a)}function x(a){var b=a.e,c=a.a;if(0!==b.length){for(var d,e,f=a.b,g=0;g<b.length;g+=3)d=b[g],e=b[g+c],d?C(c,d,e,f):e(f);a.e.length=0}}function D(){this.error=
null}function C(a,b,c,d){var e=s(c),f,k,h,l;if(e){try{f=c(d)}catch(n){y.error=n,f=y}f===y?(l=!0,k=f.error,f=null):h=!0;if(b===f){g(b,new TypeError("A promises callback cannot return that same promise."));return}}else f=d,h=!0;void 0===b.a&&(e&&h?q(b,f):l?g(b,k):1===a?m(b,f):2===a&&g(b,f))}function N(a,b){try{b(function(b){q(a,b)},function(b){g(a,b)})}catch(c){g(a,c)}}function k(a,b,c,d){this.n=a;this.c=new a(p,d);this.i=c;this.o(b)?(this.m=b,this.d=this.length=b.length,this.l(),0===this.length?m(this.c,
this.b):(this.length=this.length||0,this.k(),0===this.d&&m(this.c,this.b))):g(this.c,this.p())}function h(a){O++;this.b=this.a=void 0;this.e=[];if(p!==a){if(!s(a))throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");if(!(this instanceof h))throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");N(this,a)}}var E=Array.isArray?Array.isArray:function(a){return"[object Array]"===
Object.prototype.toString.call(a)},l=0,w="undefined"!==typeof window?window:{},B=w.MutationObserver||w.WebKitMutationObserver,w="undefined"!==typeof Uint8ClampedArray&&"undefined"!==typeof importScripts&&"undefined"!==typeof MessageChannel,n=Array(1E3),A;A="undefined"!==typeof process&&"[object process]"==={}.toString.call(process)?F():B?G():w?H():I();var v=new D,y=new D;k.prototype.o=function(a){return E(a)};k.prototype.p=function(){return Error("Array Methods must be provided an Array")};k.prototype.l=
function(){this.b=Array(this.length)};k.prototype.k=function(){for(var a=this.length,b=this.c,c=this.m,d=0;void 0===b.a&&d<a;d++)this.j(c[d],d)};k.prototype.j=function(a,b){var c=this.n;"object"===typeof a&&null!==a?a.constructor===c&&void 0!==a.a?(a.f=null,this.g(a.a,b,a.b)):this.q(c.resolve(a),b):(this.d--,this.b[b]=this.h(a))};k.prototype.g=function(a,b,c){var d=this.c;void 0===d.a&&(this.d--,this.i&&2===a?g(d,c):this.b[b]=this.h(c));0===this.d&&m(d,this.b)};k.prototype.h=function(a){return a};
k.prototype.q=function(a,b){var c=this;u(a,void 0,function(a){c.g(1,b,a)},function(a){c.g(2,b,a)})};var O=0;h.all=function(a,b){return(new k(this,a,!0,b)).c};h.race=function(a,b){function c(a){q(e,a)}function d(a){g(e,a)}var e=new this(p,b);if(!E(a))return (g(e,new TypeError("You must pass an array to race.")), e);for(var f=a.length,h=0;void 0===e.a&&h<f;h++)u(this.resolve(a[h]),void 0,c,d);return e};h.resolve=function(a,b){if(a&&"object"===typeof a&&a.constructor===this)return a;var c=new this(p,b);
q(c,a);return c};h.reject=function(a,b){var c=new this(p,b);g(c,a);return c};h.prototype={constructor:h,then:function(a,b){var c=this.a;if(1===c&&!a||2===c&&!b)return this;var d=new this.constructor(p),e=this.b;if(c){var f=arguments[c-1];r(function(){C(c,d,f,e)})}else u(this,d,a,b);return d},"catch":function(a){return this.then(null,a)}};var z={Promise:h,polyfill:function(){var a;a="undefined"!==typeof global?global:"undefined"!==typeof window&&window.document?window:self;"Promise"in a&&"resolve"in
a.Promise&&"reject"in a.Promise&&"all"in a.Promise&&"race"in a.Promise&&function(){var b;new a.Promise(function(a){b=a});return s(b)}()||(a.Promise=h)}};"function"===typeof define&&define.amd?define(function(){return z}):"undefined"!==typeof module&&module.exports?module.exports=z:"undefined"!==typeof this&&(this.ES6Promise=z)}).call(this);

/*! end es6-promise */

(function(global) {
  'use strict';

  // ------------------------------------------------------------
  // Extend
  // ------------------------------------------------------------

  Array.prototype.elemIndexBy = function(func) {
    for (var i = 0, len = this.length; i < len; ++i) {
      if (func(this[i])) return i;
    }
    return null;
  };

    
  // ------------------------------------------------------------
  // Utils
  // ------------------------------------------------------------

  var utils = global.utils = {};

  utils.touchEvent = (function() {
    var target;
    var callback = {};

    function initialize() {
      target = null;
      callback = {};
    }

    function start(e, func, thisObj) {
      target = e.target;
      callback = {
        func: func,
        this: thisObj,
        args: Array.prototype.slice.call(arguments, 3)
      };
    }

    function end(e) {
      if (e.target === target && callback.func) {
        e.preventDefault();
        e.stopPropagation();
        callback.func.apply(callback.this, callback.args);
      }
      initialize();
    }

    return {
      start: start,
      end: end,
      cancel: initialize,
      move: initialize
    };
  })();


  utils.getPlayerIdFromUrl = function() {
    return Number(location.pathname.replace(/\/player\/(\d+)/, '$1'));
  };
  
  utils.zeroPadding = function(num, len) {
    return (Array(len).join("0") + num).slice(-len);
  };

  utils.getJSON = function(url) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return;
        if (xhr.status !== 200) reject(new Error('xhr error'));
        try {
          var json = JSON.parse(xhr.responseText);
        } catch (e) {
          reject(e);
        }
        resolve(json);
      };
      xhr.open('GET', url);
      xhr.send();
    });
  };

  utils.calcMostAtbats = function(data) {
    var atbats = [];
    data.forEach(function(player) {
      var i = player.order - 1;
      atbats[i] = (atbats[i] || 0) + player.atbats.length;
    });

    return Math.max.apply(null, atbats);
  };

  utils.calcMostAtbatsOnPlayer = function(data) {
    return Math.max.apply(null, data.map(function(player) {
      return player.atbats.length;
    }));
  };

  utils.addInningBeginning = function(players) {
    var resultsTable = [];
    players.forEach(function(player) {
      resultsTable.push(player.atbats);
    });

    var xLen = resultsTable[0].length;
    var yLen = resultsTable.length;
    var inn = 1;
    for (var x = 0; x < xLen; x++) {
      for (var y = 0; y < yLen; y++) {
        var target = resultsTable[y][x];
        if (target && target.inning === inn)
          target.inningBeginning = inn++;
      }
    }

    return players;
  };

  utils.formatBattingStats = function(players) {
    var emptyCells, starting, len;
    var maximumOrder = Math.max.apply(null, players.map(function(player) {
      return player.order;
    }));
    for (var i = 1; i < maximumOrder + 1; ++i) {
      emptyCells = [];
      starting = true;
      len = 0;
      
      var ps = players.filter(function(p) {
        return p.order === i;
      });
      ps.forEach(function(p) {
        len += p.atbats.length;
      });
      ps.forEach(function(p) {
        if (!starting) p.order = '';
        else starting = false;
        p.atbats = emptyCells.concat(p.atbats);
        emptyCells = emptyCells.concat(new Array(p.atbats.length));
        p.atbats = p.atbats.concat(new Array(len - p.atbats.length));
      });
    }

    return utils.addInningBeginning(players);
  };

  utils.formatRatio = function(len, ratio) {
    if (ratio === null) return '';
    if (ratio === 0) return ".000";
    if (ratio.toString() === 'NaN') return "-";
    
    var str = (Math.round(ratio * Math.pow(10, len)) / Math.pow(10, len))
               .toString();
    str += (str.indexOf('.') !== -1) ? '000' : '.000';
    if (ratio < 1)
      return str.slice(1, 2 + len);
    else
      return str.slice(0, 2 + len);
  };

  utils.sortObjsByKey = function(key, objs, desc) {
    objs.sort(function(a, b) {
      if (a[key] === null) return 1;
      if (b[key] === null) return -1;
      var x = desc ? a : b;
      var y = desc ? b : a;
      return x[key] > y[key] ? -1 : 1;
    });
  };

  utils.scanl = function(a, b, c) {
    var acc, xs, fn;
    if (arguments.length === 2) {
      acc = a[0];
      xs = a.slice(1);
      fn = b;
    } else if (arguments.length === 3){
      acc = a;
      xs = b;
      fn = c;
    } else {
      throw new Error('invalid arguments');
    }
    var result = [acc];
    xs.forEach(function(x) {
      var y = fn(acc, x);
      acc = y;
      result.push(y);
    });
    return result;
  };

  utils.buildSBText = function(players) {
    var sbs = [];
    players.forEach(function(player) {
      if (player.sb === 1)
        sbs.push(player.name);
      else if (player.sb)
        sbs.push(player.name + '(' + player.sb + ')');
    });
    return sbs.join(', ');
  };

  utils.buildErrorText = function(players) {
    var errors = [];
    players.forEach(function(player) {
      if (player.error === 1)
        errors.push(player.name);
      else if (player.error)
        errors.push(player.name + '(' + player.error + ')');
    });
    return errors.join(', ');
  };


  // ------------------------------------------------------------
  // Graph
  // ------------------------------------------------------------

  var graph = utils.graph = {};

  graph.draw = function(parent, history) {
    var cvs = graph.makeCanvases(parent);
    var lineCtx = cvs.line.getContext('2d');
    var rulerCtx = cvs.line.getContext('2d');

    var w = cvs.line.width;
    var h = cvs.line.height;

    var size = h / 30;
    var lineRect = graph.createRect(size, size, w - size*2, h - size*2);
    graph.drawLine(lineCtx, lineRect, history, size);
  };

  graph.makeCanvases = function(parent) {
    parent.style.position = (function(pos) {
      if (!pos || pos === 'static') return 'relative';
      return pos;
    })(parent.style.position);
    var parentRect = parent.getBoundingClientRect();

    var canvas = document.createElement('canvas');
    canvas.width = parentRect.width;
    canvas.height = parentRect.height;
    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.style.left = 0;

    var frag = document.createDocumentFragment();
    var rulerLayer = canvas.cloneNode();
    var lineLayer = canvas.cloneNode();
    frag.insertBefore(rulerLayer, null);
    frag.insertBefore(lineLayer, null);
    parent.appendChild(frag);

    return {
      line: lineLayer,
      ruler: rulerLayer,
    };
  };
  
  graph.createRect = function(x, y, w, h) {
    return {
      width: w,
      height: h,
      left: x,
      right: w + x,
      top: y,
      bottom: h + y,
    };
  };

  graph.buildHistory = function(results, countKeys, calcFunc) {
    var newResults = results.slice(0);
    newResults[0].value = calcFunc(newResults[0]);

    var history = utils.scanl(newResults, function(acc, x) {
      var newAcc = {};
      countKeys.forEach(function(key) {
        newAcc[key] = acc[key] + x[key];
      });
      newAcc.value = calcFunc(newAcc);
      return newAcc;
    });

    var max = Math.max.apply(Math, history.map(function(x) {
      return x.value;
    }));

    history.forEach(function(x) {
      x.rate = x.value / max;
    });

    return history;
  };

  graph.drawLine = function(ctx, rect, values, circleSize) {
    var w = rect.width;
    var h = rect.height;
    var xOffset = rect.left;
    var yOffset = rect.top;
    var space = rect.width / (values.length - 1);
    
    ctx.beginPath();
    values.forEach(function(val, i) {
      var x = space * i + xOffset;
      var y = h - h * val.rate + yOffset;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    values.forEach(function(val, i) {
      var x = space * i + xOffset;
      var y = h - h * val.rate + yOffset;
      ctx.beginPath();
      ctx.arc(x, y, circleSize, Math.PI*2, false);
      ctx.fill();
    });    
  };

  
  // ------------------------------------------------------------
  // Vue
  // ------------------------------------------------------------

  // configs
  
  // Vue.config.prefix = 'data-v-';

  // filters

  var resultDic = {
    'win': '勝',
    'lose': '敗',
    'hold': 'H',
    'save': 'S',
  };
  
  Vue.filter('formatDate', function(dateString) {
    var date = new Date(dateString);
    return date.getFullYear() + '年' +
      utils.zeroPadding(date.getMonth() + 1, 2) + '月' +
      utils.zeroPadding(date.getDate(), 2) + '日';
  });
  Vue.filter('formatInternalDate', function(dateString) {
    var date = new Date(dateString);
    var str = date.getFullYear() + '-' +
          utils.zeroPadding(date.getMonth()+1, 2) + '-' +
          utils.zeroPadding(date.getDate(), 2);
    return str;
  });
  Vue.filter('formatInning', function(num) {
    return num ? num + '回' : '';
  });
  Vue.filter('formatRatio', function(ratio) {
    return utils.formatRatio(3, ratio);
  });
  Vue.filter('formatRatio2', function(ratio) {
    return utils.formatRatio(2, ratio);
  });
  Vue.filter('formatResult', function(result) {
    if (!result) return '';
    return resultDic[result];
  });
  Vue.filter('runsToString', function(num) {
    return num === null ? '×' : String(num);
  });
  Vue.filter('outToInning', function(num) {
    return [Math.floor(num / 3), '回 ', num % 3 + '/3'].join('');
  });

})((this || 0).self || global);
