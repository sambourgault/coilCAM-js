// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"coilcam-functions/setup/GCodeGenerator.js":[function(require,module,exports) {
//Helper functions for generateGCode
function extrude(nozzleDiameter, layerHeight, segmentLen) {
  console;
  var points = [];
  var extrusion_multiplier = nozzleDiameter / 1.91 ^ 2; //extrusion multiplier for correct filament thickness
  var totalExtruded = 0;
  points.push(0);
  for (var i = 0; i < segmentLen.length; i++) {
    var newPoint = segmentLen[i] * layerHeight / nozzleDiameter * (4 / Math.PI + layerHeight / nozzleDiameter);
    totalExtruded += newPoint;
    newPoint = (newPoint + totalExtruded) * extrusion_multiplier;
    points.push(newPoint);
  }
  // E = SegmentLen*LayerHeight/NozzleWidth * (4/math.pi + LayerHeight/NozzleWidth)
  return points;
}
var round2pt = function round2pt(value) {
  return Math.floor(value * 100) / 100.0;
};
var euclideanDist = function euclideanDist(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2));
};

//Main functions to generate GCode, calculate clay height, calculate number of tubes
function generateGCode(path, layerHeight, nozzleDiameter, printSpeed) {
  //main function
  // printSpeed, nozzleDiameter, LayerHeight: float
  // path: array of point3
  var printSpeeds = [10000]; //First move should be 10000
  var segmentLen = [];
  for (var i = 0; i < path.length - 3; i += 3) {
    segmentLen.push(euclideanDist(path.slice(i, i + 3), path.slice(i + 3, i + 6))); //path is array of #s, not points
    // printSpeeds.push(Math.floor(printSpeed[i]*60));
    printSpeeds.push(Math.floor(printSpeed * 60));
  }
  ;
  var extr = extrude(nozzleDiameter, layerHeight, segmentLen);
  console.log("Extrusions", extr);
  var startGcodePrefix = ';;; START GCODE ;;;\nM82 ;absolute extrusion mode\nG28 ;Home\nG1 X207.5 Y202.5 Z20 F10000 ;Move X and Y to center, Z to 20mm high\nG1 E2000 F20000 ; !!Prime Extruder\nG92 E0\nG1 F30000 E-150\n;;; ======';
  var endGcodePostfix = ";;; === END GCODE ===\nM83 ;Set to Relative Extrusion Mode\nG28 Z ;Home Z\n; === DEPRESSURIZE ===\nG91\nG91\nG1 E-1300 F4000\nG90\nG90";
  var gcode = [startGcodePrefix];
  gcode.push(startGcodePrefix);
  for (var i = 0; i < path.length / 3; i++) {
    //path is an array of ints, not represented as tuples
    x = round2pt(path[i * 3]);
    y = round2pt(path[i * 3 + 1]);
    z = round2pt(path[i * 3 + 2]);
    gcode.push("G1 F" + printSpeeds[i] + " X" + x + " Y" + y + " Z" + z + " E" + extr[i]);
  }
  gcode.push(endGcodePostfix);
  return gcode;
}

//Not fully implemented in Rhino, may not be correct
function getNumTubes(path, nozzleDiameter, layerHeight) {
  var segmentLen = [];
  for (var i = 1; i < len(path); i++) {
    segmentLen.push(euclideanDist(path[i], path[i - 1]));
  }
  var extrusions = extrude(nozzleDiameter, layerHeight, segmentLen);
  var totalExtrusion = extrusions[extrusions.length - 1];
  return (nozzleDiameter / 2 ^ 2 * totalExtrusion) / (95.5 / 2 ^ 2) / 430; //multiplier from original gcode
}

// //Stub: using preset values
// function calculateClayHeight(path, preset){ 
//     return calculateClayHeight(path, preset.nozzleDiameter, preset.layerHeight);
// }

//Stub: not fully implemented in Rhino, not sure what the value of multiplier should be
function calculateClayHeight(nozzleDiameter, path, layerHeight, extrusionMultiplier) {
  extrusionMultiplier = 0; //Extrusion multiplier exists for Super Potterbot but is unused
  return getNumTubes(nozzleDiameter, path, layerHeight) * extrusionMultiplier;
}

//Stub: Function to spiralize, add base, center print
function buildVessel(path, layerHeight, bedSize) {
  var spiralize = spiralize(path, layerHeight);
  var base = circlularBase(position = [0, 0, 0], radius = 48.0, layerHeight = layerHeight, nbLayers = 3, nbPointsInLayer = 22); //preset
  var centered = centerPrint(base, preset);
  return generateGCode(centered, preset);
}
},{}],"../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53885" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","coilcam-functions/setup/GCodeGenerator.js"], null)
//# sourceMappingURL=/GCodeGenerator.55af4b37.js.map