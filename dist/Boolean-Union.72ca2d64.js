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
})({"node_modules/flatten-js/utils/utils.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 2/18/2017.
 */

/**
 * Global constant DP_TOL is used for comparison of floating point numbers.
 * It is set to 0.000001.
 * @type {number}
 */
const DP_TOL = 0.000001;
const DECIMALS = 3;
module.exports = {
  DP_TOL: DP_TOL,
  /**
   * Returns *true* if value comparable to zero
   * @return {boolean}
   */
  EQ_0: function (x) {
    return x < DP_TOL && x > -DP_TOL;
  },
  /**
   * Returns *true* if two values are equal up to DP_TOL
   * @return {boolean}
   */
  EQ: function (x, y) {
    return x - y < DP_TOL && x - y > -DP_TOL;
  },
  /**
   * Returns *true* if first argument greater than second argument up to DP_TOL
   * @return {boolean}
   */
  GT: (x, y) => {
    return x - y > DP_TOL;
  },
  /**
   * Returns *true* if first argument greater than or equal to second argument up to DP_TOL
   * @return {boolean}
   */
  GE: (x, y) => {
    return x - y > -DP_TOL;
  },
  /**
   * Returns *true* if first argument less than second argument up to DP_TOL
   * @return {boolean}
   */
  LT: (x, y) => {
    return x - y < -DP_TOL;
  },
  /**
   * Returns *true* if first argument less than or equal to second argument up to DP_TOL
   * @return {boolean}
   */
  LE: (x, y) => {
    return x - y < DP_TOL;
  }
};
},{}],"node_modules/flatten-js/utils/errors.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 2/19/2017.
 */
module.exports = {
  ILLEGAL_PARAMETERS: new ReferenceError('Illegal Parameters'),
  ZERO_DIVISION: new Error('Zero division')
};
},{}],"node_modules/flatten-js/classes/matrix.js":[function(require,module,exports) {
"use strict";

module.exports = function (Flatten) {
  /**
   * Class representing an affine transformation 3x3 matrix:
   * <pre>
   *      [ a  c  tx
   * A =    b  d  ty
   *        0  0  1  ]
   * </pre
   * @type {Matrix}
   */
  Flatten.Matrix = class Matrix {
    /**
     * Construct new instance of affine transformation matrix <br/>
     * If parameters omitted, construct identity matrix a = 1, d = 1
     * @param {number} a - position(0,0)   sx*cos(alpha)
     * @param {number} b - position (0,1)  sx*sin(alpha)
     * @param {number} c - position (1,0)  -sy*sin(alpha)
     * @param {number} d - position (1,1)  sy*cos(alpha)
     * @param {number} tx - position (2,0) translation by x
     * @param {number} ty - position (2,1) translation by y
     */
    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
      this.tx = tx;
      this.ty = ty;
    }

    /**
     * Returns a clone of the Matrix instance.
     * @return {Matrix}
     **/
    clone() {
      return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }
    /**
     * Transform vector [x,y] using transformation matrix. <br/>
     * Vector [x,y] is an abstract array[2] of numbers and not a FlattenJS object <br/>
     * The result is also an abstract vector [x',y'] = A * [x,y]:
     * <code>
     * [x'       [ ax + by + tx
     *  y'   =     cx + dy + ty
     *  1]                    1 ]
     * </code>
     * @param {number[]} vector - array[2] of numbers
     * @returns {number[]} transformation result - array[2] of numbers
     */
    transform(vector) {
      return [vector[0] * this.a + vector[1] * this.c + this.tx, vector[0] * this.b + vector[1] * this.d + this.ty];
    }
    /**
     * Returns result of multiplication of this matrix by other matrix
     * @param {Matrix} other_matrix - matrix to multiply by
     * @returns {Matrix}
     */
    multiply(other_matrix) {
      return new Matrix(this.a * other_matrix.a + this.c * other_matrix.b, this.b * other_matrix.a + this.d * other_matrix.b, this.a * other_matrix.c + this.c * other_matrix.d, this.b * other_matrix.c + this.d * other_matrix.d, this.a * other_matrix.tx + this.c * other_matrix.ty + this.tx, this.b * other_matrix.tx + this.d * other_matrix.ty + this.ty);
    }
    /**
     * Return new matrix as a result of multiplication of the current matrix
     * by the matrix(1,0,0,1,tx,ty)
     * @param {number} tx - translation by x
     * @param {number} ty - translation by y
     * @returns {Matrix}
     */
    translate(...args) {
      let tx, ty;
      if (args.length == 1 && args[0] instanceof Flatten.Vector) {
        tx = args[0].x;
        ty = args[0].y;
      } else if (args.length == 2 && typeof args[0] == "number" && typeof args[1] == "number") {
        tx = args[0];
        ty = args[1];
      } else {
        throw Flatten.Errors.ILLEGAL_PARAMETERS;
      }
      return this.multiply(new Matrix(1, 0, 0, 1, tx, ty));
    }
    /**
     * Return new matrix as a result of multiplication of the current matrix
     * by the matrix that defines rotation by given angle (in radians) around
     * point (0,0) in counter clockwise direction
     * @param angle
     * @returns {Matrix}
     */
    rotate(angle) {
      let cos = Math.cos(angle);
      let sin = Math.sin(angle);
      return this.multiply(new Matrix(cos, sin, -sin, cos, 0, 0));
    }
    /**
     * Return new matrix as a result of multiplication of the current matrix
     * by the matrix (sx,0,0,sy,0,0) that defines scaling
     * @param sx
     * @param sy
     * @returns {Matrix}
     */
    scale(sx, sy) {
      return this.multiply(new Matrix(sx, 0, 0, sy, 0, 0));
    }
    /**
     * Returns true if two matrix are equal parameter by parameter
     * @param {Matrix} matrix - other matrix
     * @returns {boolean} true if equal, false otherwise
     */
    equalTo(matrix) {
      if (!Flatten.Utils.EQ(this.tx, matrix.tx)) return false;
      if (!Flatten.Utils.EQ(this.ty, matrix.ty)) return false;
      if (!Flatten.Utils.EQ(this.a, matrix.a)) return false;
      if (!Flatten.Utils.EQ(this.b, matrix.b)) return false;
      if (!Flatten.Utils.EQ(this.c, matrix.c)) return false;
      if (!Flatten.Utils.EQ(this.d, matrix.d)) return false;
      return true;
    }
  };

  /**
   * Function to create matrix equivalent to "new" constructor
   * @param args
   */
  Flatten.matrix = (...args) => new Flatten.Matrix(...args);
};
},{}],"node_modules/flatten-interval-tree/classes/interval.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 4/1/2017.
 */

let Interval = class Interval {
    constructor(low, high) {
        this.low = low;
        this.high = high;
    }

    get max() {
        return this.high;
    }

    interval(low, high) {
        return new Interval(low, high);
    }

    clone() {
        return new Interval(this.low, this.high);
    }

    less_than(other_interval) {
        return this.low < other_interval.low ||
            this.low == other_interval.low && this.high < other_interval.high;
    }

    equal_to(other_interval) {
        return this.low == other_interval.low && this.high == other_interval.high;
    }

    intersect(other_interval) {
        return !this.not_intersect(other_interval);
    }

    not_intersect(other_interval) {
        return (this.high < other_interval.low || other_interval.high < this.low);
    }

    output() {
        return [this.low, this.high];
    }

    maximal_val(val1, val2) {
        return Math.max(val1, val2);
    }

    val_less_than(val1, val2 ) {     // trait to compare max property with item ?
        return val1 < val2;
    }
};

module.exports = Interval;

},{}],"node_modules/flatten-interval-tree/utils/constants.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 3/28/2017.
 */

'use strict';

module.exports = {
    RB_TREE_COLOR_RED: 0,
    RB_TREE_COLOR_BLACK: 1
};
},{}],"node_modules/flatten-interval-tree/classes/node.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 4/1/2017.
 */

'use strict';

// let defaultTraits = require('../utils/numeric_traits');
let Interval = require('../classes/interval');
let {RB_TREE_COLOR_RED, RB_TREE_COLOR_BLACK} = require('../utils/constants');

let Node = class Node {
    constructor(key = undefined, value = undefined,
                left = null, right = null, parent = null, color = RB_TREE_COLOR_BLACK) {
        this.left = left;                     // reference to left child node
        this.right = right;                   // reference to right child node
        this.parent = parent;                 // reference to parent node
        this.color = color;

        this.item = {key: key, value: value};   // key is supposed to be       instance of Interval

        /* If not, this should by an array of two numbers */
        if (key && key instanceof Array && key.length == 2) {
            if (!Number.isNaN(key[0]) && !Number.isNaN(key[1])) {
                this.item.key = new Interval(Math.min(key[0], key[1]), Math.max(key[0], key[1]));
            }
        }
        this.max = this.item.key ? this.item.key.max : undefined;
    }

    isNil() {
        return (this.item.key === undefined && this.item.value === undefined &&
            this.left === null && this.right === null && this.color === RB_TREE_COLOR_BLACK);
    }

    less_than(other_node) {
        return this.item.key.less_than(other_node.item.key);
    }

    equal_to(other_node) {
        let value_equal = true;
        if (this.item.value && other_node.item.value) {
            value_equal = this.item.value.equal_to ? this.item.value.equal_to(other_node.item.value) :
                this.item.value == other_node.item.value;
        }
        return this.item.key.equal_to(other_node.item.key) && value_equal;
    }

    intersect(other_node) {
        return this.item.key.intersect(other_node.item.key);
    }

    copy_data(other_node) {
        this.item.key = other_node.item.key.clone();
        this.item.value = other_node.item.value;
    }

    update_max() {
        // use key (Interval) max property instead of key.high
        this.max = this.item.key ? this.item.key.max : undefined;
        if (this.right && this.right.max) {
            let maximal_val = this.item.key.maximal_val;
            this.max = maximal_val(this.max, this.right.max);
        }
        if (this.left && this.left.max) {
            let maximal_val = this.item.key.maximal_val;
            this.max = maximal_val(this.max, this.left.max);
        }
    }

    // Other_node does not intersect any node of left subtree, if this.left.max < other_node.item.key.low
    not_intersect_left_subtree(search_node) {
        let val_less_than = this.item.key.val_less_than;
        let high = this.left.max.high ? this.left.max.high : this.left.max;
        return val_less_than(high, search_node.item.key.low);
    }

    // Other_node does not intersect right subtree if other_node.item.key.high < this.right.key.low
    not_intersect_right_subtree(search_node) {
        let val_less_than = this.item.key.val_less_than;
        let low = this.right.max.low ? this.right.max.low : this.right.item.key.low;
        return val_less_than(search_node.item.key.high, low);
    }
};

module.exports = Node;


},{"../classes/interval":"node_modules/flatten-interval-tree/classes/interval.js","../utils/constants":"node_modules/flatten-interval-tree/utils/constants.js"}],"node_modules/flatten-interval-tree/index.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 3/31/2017.
 */
'use strict';

let Node = require('./classes/node');
let {RB_TREE_COLOR_RED, RB_TREE_COLOR_BLACK} = require('./utils/constants');

let nil_node = new Node();

/**
 * Implementation of interval binary search tree <br/>
 * Interval tree may store items which are couples of {key:interval, value: value} <br/>
 * Interval is an object with high and low properties or simply array of numeric [low,high] values <br />
 * If interval is an object, it should implement and expose methods less_than, equals_to, intersect and others,
 * see documentation {link}
 * @type {IntervalTree}
 */
let IntervalTree = class IntervalTree {
    /**
     * Construct new empty instance of IntervalTree
     */
    constructor() {
        this.root = null;
    }

    /**
     * Returns number of items stored in the interval tree
     * @returns {number}
     */
    get size() {
        let count = 0;
        this.tree_walk(this.root, () => count++);
        return count;
    }

    /**
     * Returns array of sorted keys in the ascending order
     * @returns {Array}
     */
    get keys() {
        let res = [];
        this.tree_walk(this.root, (node) => res.push(node.item.key.output()));
        return res;
    }

    /**
     * Return array of values in the ascending keys order
     * @returns {Array}
     */
    get values() {
        let res = [];
        this.tree_walk(this.root, (node) => res.push(node.item.value));
        return res;
    }

    /**
     * Returns array of items (<key,value> pairs) in the ascended keys order
     * @returns {Array}
     */
    get items() {
        let res = [];
        this.tree_walk(this.root, (node) => res.push({key: node.item.key.output(), value: node.item.value}));
        return res;
    }

    /**
     * Returns true if tree is empty
     * @returns {boolean}
     */
    get isEmpty() {
        return (this.root == null || this.root == nil_node);
    }

    /**
     * Insert new item into interval tree
     * @param key - interval object or array of two numbers [low, high]
     * @param value - value representing any object (optional)
     * @returns {Node} - returns reference to inserted node as an object {key:interval, value: value}
     */
    insert(key, value = key) {
        if (key === undefined) return;
        let insert_node = new Node(key, value, nil_node, nil_node, null, RB_TREE_COLOR_RED);
        this.tree_insert(insert_node);
        this.recalc_max(insert_node);
        return insert_node;
    }

    /**
     * Returns true if item {key,value} exist in the tree
     * @param key - interval correspondent to keys stored in the tree
     * @param value - value object to be checked
     * @returns {boolean} - true if item {key, value} exist in the tree, false otherwise
     */
    exist(key, value) {
        let search_node = new Node(key, value);
        return this.tree_search(this.root, search_node) ? true : false;
    }

    /**
     * Remove entry {key, value} from the tree
     * @param key - interval correspondent to keys stored in the tree
     * @param value - - value object
     * @returns {boolean} - true if item {key, value} deleted, false if not found
     */
    remove(key, value) {
        let search_node = new Node(key, value);
        let delete_node = this.tree_search(this.root, search_node);
        if (delete_node) {
            this.tree_delete(delete_node);
        }
        return delete_node;
    }

    /**
     * Returns array of entry values which keys intersect with given interval <br/>
     * If no values stored in the tree, returns array of keys which intersect given interval
     * @param interval - search interval, or array [low, high]
     * @returns {Array}
     */
    search(interval) {
        let search_node = new Node(interval);
        let resp_nodes = [];
        this.tree_search_interval(this.root, search_node, resp_nodes);
        let resp = [];
        resp_nodes.forEach((node) => {
            if (node.item.value) {         // if there are values, return only values
                resp.push(node.item.value);
            }
            else {                         // otherwise, return keys
                resp.push(node.item.key.output());
            }
        }, []);
        return resp;
    }

    /**
     * Tree visitor. For each node implement a callback function. <br/>
     * Method calls a callback function with two parameters (key, value)
     * @param visitor(key,value) - function to be called for each tree item
     */
    forEach(visitor) {
        this.tree_walk(this.root, (node) => visitor(node.item.key, node.item.value));
    }
    
    /** Value Mapper. Walk through every node and map node value to another value
     * @param callback(value, key) - function to be called for each tree item
     */
    map(callback) {
        const tree = new IntervalTree();
        this.tree_walk(this.root, (node) => tree.insert(node.item.key, callback(node.item.value, node.item.key)));
        return tree;
    }

    recalc_max(node) {
        let node_current = node;
        while (node_current.parent != null) {
            node_current.parent.update_max();
            node_current = node_current.parent;
        }
    }

    tree_insert(insert_node) {
        let current_node = this.root;
        let parent_node = null;

        if (this.root == null || this.root == nil_node) {
            this.root = insert_node;
        }
        else {
            while (current_node != nil_node) {
                parent_node = current_node;
                if (insert_node.less_than(current_node)) {
                    current_node = current_node.left;
                }
                else {
                    current_node = current_node.right;
                }
            }

            insert_node.parent = parent_node;

            if (insert_node.less_than(parent_node)) {
                parent_node.left = insert_node;
            }
            else {
                parent_node.right = insert_node;
            }
        }

        this.insert_fixup(insert_node);
    }

// After insertion insert_node may have red-colored parent, and this is a single possible violation
// Go upwords to the root and re-color until violation will be resolved
    insert_fixup(insert_node) {
        let current_node;
        let uncle_node;

        current_node = insert_node;
        while (current_node != this.root && current_node.parent.color == RB_TREE_COLOR_RED) {
            if (current_node.parent == current_node.parent.parent.left) {   // parent is left child of grandfather
                uncle_node = current_node.parent.parent.right;              // right brother of parent
                if (uncle_node.color == RB_TREE_COLOR_RED) {             // Case 1. Uncle is red
                    // re-color father and uncle into black
                    current_node.parent.color = RB_TREE_COLOR_BLACK;
                    uncle_node.color = RB_TREE_COLOR_BLACK;
                    current_node.parent.parent.color = RB_TREE_COLOR_RED;
                    current_node = current_node.parent.parent;
                }
                else {                                                    // Case 2 & 3. Uncle is black
                    if (current_node == current_node.parent.right) {     // Case 2. Current if right child
                        // This case is transformed into Case 3.
                        current_node = current_node.parent;
                        this.rotate_left(current_node);
                    }
                    current_node.parent.color = RB_TREE_COLOR_BLACK;    // Case 3. Current is left child.
                    // Re-color father and grandfather, rotate grandfather right
                    current_node.parent.parent.color = RB_TREE_COLOR_RED;
                    this.rotate_right(current_node.parent.parent);
                }
            }
            else {                                                         // parent is right child of grandfather
                uncle_node = current_node.parent.parent.left;              // left brother of parent
                if (uncle_node.color == RB_TREE_COLOR_RED) {             // Case 4. Uncle is red
                    // re-color father and uncle into black
                    current_node.parent.color = RB_TREE_COLOR_BLACK;
                    uncle_node.color = RB_TREE_COLOR_BLACK;
                    current_node.parent.parent.color = RB_TREE_COLOR_RED;
                    current_node = current_node.parent.parent;
                }
                else {
                    if (current_node == current_node.parent.left) {             // Case 5. Current is left child
                        // Transform into case 6
                        current_node = current_node.parent;
                        this.rotate_right(current_node);
                    }
                    current_node.parent.color = RB_TREE_COLOR_BLACK;    // Case 6. Current is right child.
                    // Re-color father and grandfather, rotate grandfather left
                    current_node.parent.parent.color = RB_TREE_COLOR_RED;
                    this.rotate_left(current_node.parent.parent);
                }
            }
        }

        this.root.color = RB_TREE_COLOR_BLACK;
    }

    tree_delete(delete_node) {
        let cut_node;   // node to be cut - either delete_node or successor_node  ("y" from 14.4)
        let fix_node;   // node to fix rb tree property   ("x" from 14.4)

        if (delete_node.left == nil_node || delete_node.right == nil_node) {  // delete_node has less then 2 children
            cut_node = delete_node;
        }
        else {                                                    // delete_node has 2 children
            cut_node = this.tree_successor(delete_node);
        }

        // fix_node if single child of cut_node
        if (cut_node.left != nil_node) {
            fix_node = cut_node.left;
        }
        else {
            fix_node = cut_node.right;
        }

        // remove cut_node from parent
        /*if (fix_node != nil_node) {*/
            fix_node.parent = cut_node.parent;
        /*}*/

        if (cut_node == this.root) {
            this.root = fix_node;
        }
        else {
            if (cut_node == cut_node.parent.left) {
                cut_node.parent.left = fix_node;
            }
            else {
                cut_node.parent.right = fix_node;
            }
            cut_node.parent.update_max();        // update max property of the parent
        }

        this.recalc_max(fix_node);              // update max property upward from fix_node to root

        // COPY DATA !!!
        // Delete_node becomes cut_node, it means that we cannot hold reference
        // to node in outer structure and we will have to delete by key, additional search need
        if (cut_node != delete_node) {
            delete_node.copy_data(cut_node);
            delete_node.update_max();           // update max property of the cut node at the new place
            this.recalc_max(delete_node);       // update max property upward from delete_node to root
        }

        if (/*fix_node != nil_node && */cut_node.color == RB_TREE_COLOR_BLACK) {
            this.delete_fixup(fix_node);
        }
    }

    delete_fixup(fix_node) {
        let current_node = fix_node;
        let brother_node;

        while (current_node != this.root && current_node.parent != null && current_node.color == RB_TREE_COLOR_BLACK) {
            if (current_node == current_node.parent.left) {          // fix node is left child
                brother_node = current_node.parent.right;
                if (brother_node.color == RB_TREE_COLOR_RED) {   // Case 1. Brother is red
                    brother_node.color = RB_TREE_COLOR_BLACK;         // re-color brother
                    current_node.parent.color = RB_TREE_COLOR_RED;    // re-color father
                    this.rotate_left(current_node.parent);
                    brother_node = current_node.parent.right;                      // update brother
                }
                // Derive to cases 2..4: brother is black
                if (brother_node.left.color == RB_TREE_COLOR_BLACK &&
                    brother_node.right.color == RB_TREE_COLOR_BLACK) {  // case 2: both nephews black
                    brother_node.color = RB_TREE_COLOR_RED;              // re-color brother
                    current_node = current_node.parent;                  // continue iteration
                }
                else {
                    if (brother_node.right.color == RB_TREE_COLOR_BLACK) {   // case 3: left nephew red, right nephew black
                        brother_node.color = RB_TREE_COLOR_RED;          // re-color brother
                        brother_node.left.color = RB_TREE_COLOR_BLACK;   // re-color nephew
                        this.rotate_right(brother_node);
                        brother_node = current_node.parent.right;                     // update brother
                        // Derive to case 4: left nephew black, right nephew red
                    }
                    // case 4: left nephew black, right nephew red
                    brother_node.color = current_node.parent.color;
                    current_node.parent.color = RB_TREE_COLOR_BLACK;
                    brother_node.right.color = RB_TREE_COLOR_BLACK;
                    this.rotate_left(current_node.parent);
                    current_node = this.root;                         // exit from loop
                }
            }
            else {                                             // fix node is right child
                brother_node = current_node.parent.left;
                if (brother_node.color == RB_TREE_COLOR_RED) {   // Case 1. Brother is red
                    brother_node.color = RB_TREE_COLOR_BLACK;         // re-color brother
                    current_node.parent.color = RB_TREE_COLOR_RED;    // re-color father
                    this.rotate_right(current_node.parent);
                    brother_node = current_node.parent.left;                        // update brother
                }
                // Go to cases 2..4
                if (brother_node.left.color == RB_TREE_COLOR_BLACK &&
                    brother_node.right.color == RB_TREE_COLOR_BLACK) {   // case 2
                    brother_node.color = RB_TREE_COLOR_RED;             // re-color brother
                    current_node = current_node.parent;                              // continue iteration
                }
                else {
                    if (brother_node.left.color == RB_TREE_COLOR_BLACK) {  // case 3: right nephew red, left nephew black
                        brother_node.color = RB_TREE_COLOR_RED;            // re-color brother
                        brother_node.right.color = RB_TREE_COLOR_BLACK;    // re-color nephew
                        this.rotate_left(brother_node);
                        brother_node = current_node.parent.left;                        // update brother
                        // Derive to case 4: right nephew black, left nephew red
                    }
                    // case 4: right nephew black, left nephew red
                    brother_node.color = current_node.parent.color;
                    current_node.parent.color = RB_TREE_COLOR_BLACK;
                    brother_node.left.color = RB_TREE_COLOR_BLACK;
                    this.rotate_right(current_node.parent);
                    current_node = this.root;                               // force exit from loop
                }
            }
        }

        current_node.color = RB_TREE_COLOR_BLACK;
    }

    tree_search(node, search_node) {
        if (node == null || node == nil_node)
            return undefined;

        if (search_node.equal_to(node)) {
            return node;
        }
        if (search_node.less_than(node)) {
            return this.tree_search(node.left, search_node);
        }
        else {
            return this.tree_search(node.right, search_node);
        }
    }

    // Original search_interval method; container res support push() insertion
    // Search all intervals intersecting given one
    tree_search_interval(node, search_node, res) {
        if (node != null && node != nil_node) {
            // if (node->left != nil_node && node->left->max >= low) {
            if (node.left != nil_node && !node.not_intersect_left_subtree(search_node)) {
                this.tree_search_interval(node.left, search_node, res);
            }
            // if (low <= node->high && node->low <= high) {
            if (node.intersect(search_node)) {
                res.push(node);
            }
            // if (node->right != nil_node && node->low <= high) {
            if (node.right != nil_node && !node.not_intersect_right_subtree(search_node)) {
                this.tree_search_interval(node.right, search_node, res);
            }
        }
    }

    local_minimum(node) {
        let node_min = node;
        while (node_min.left != null && node_min.left != nil_node) {
            node_min = node_min.left;
        }
        return node_min;
    }

    // not in use
    local_maximum(node) {
        let node_max = node;
        while (node_max.right != null && node_max.right != nil_node) {
            node_max = node_max.right;
        }
        return node_max;
    }

    tree_successor(node) {
        let node_successor;
        let current_node;
        let parent_node;

        if (node.right != nil_node) {
            node_successor = this.local_minimum(node.right);
        }
        else {
            current_node = node;
            parent_node = node.parent;
            while (parent_node != null && parent_node.right == current_node) {
                current_node = parent_node;
                parent_node = parent_node.parent;
            }
            node_successor = parent_node;
        }
        return node_successor;
    }

    //           |            right-rotate(T,y)       |
    //           y            ---------------.       x
    //          / \                                  / \
    //         x   c          left-rotate(T,x)      a   y
    //        / \             <---------------         / \
    //       a   b                                    b   c

    rotate_left(x) {
        let y = x.right;

        x.right = y.left;           // b goes to x.right

        if (y.left != nil_node) {
            y.left.parent = x;     // x becomes parent of b
        }
        y.parent = x.parent;       // move parent

        if (x == this.root) {
            this.root = y;           // y becomes root
        }
        else {                        // y becomes child of x.parent
            if (x == x.parent.left) {
                x.parent.left = y;
            }
            else {
                x.parent.right = y;
            }
        }
        y.left = x;                 // x becomes left child of y
        x.parent = y;               // and y becomes parent of x

        if (x != null && x != nil_node) {
            x.update_max();
        }

        y = x.parent;
        if (y != null && y != nil_node) {
            y.update_max();
        }
    }

    rotate_right(y) {
        let x = y.left;

        y.left = x.right;           // b goes to y.left

        if (x.right != nil_node) {
            x.right.parent = y;        // y becomes parent of b
        }
        x.parent = y.parent;          // move parent

        if (y == this.root) {        // x becomes root
            this.root = x;
        }
        else {                        // y becomes child of x.parent
            if (y == y.parent.left) {
                y.parent.left = x;
            }
            else {
                y.parent.right = x;
            }
        }
        x.right = y;                 // y becomes right child of x
        y.parent = x;               // and x becomes parent of y

        if (y != null && y != nil_node) {
            y.update_max();
        }

        x = y.parent;
        if (x != null && x != nil_node) {
            x.update_max();
        }
    }

    tree_walk(node, action) {
        if (node != null && node != nil_node) {
            this.tree_walk(node.left, action);
            // arr.push(node.output());
            action(node);
            this.tree_walk(node.right, action);
        }
    }

    /* Return true if all red nodes have exactly two black child nodes */
    testRedBlackProperty() {
        let res = true;
        this.tree_walk(this.root, function (node) {
            if (node.color == RB_TREE_COLOR_RED) {
                if (!(node.left.color == RB_TREE_COLOR_BLACK && node.right.color == RB_TREE_COLOR_BLACK)) {
                    res = false;
                }
            }
        });
        return res;
    }

    /* Throw error if not every path from root to bottom has same black height */
    testBlackHeightProperty(node) {
        let height = 0;
        let heightLeft = 0;
        let heightRight = 0;
        if (node.color == RB_TREE_COLOR_BLACK) {
            height++;
        }
        if (node.left != nil_node) {
            heightLeft = this.testBlackHeightProperty(node.left);
        }
        else {
            heightLeft = 1;
        }
        if (node.right != nil_node) {
            heightRight = this.testBlackHeightProperty(node.right);
        }
        else {
            heightRight = 1;
        }
        if (heightLeft != heightRight) {
            throw new Error('Red-black height property violated');
        }
        height += heightLeft;
        return height;
    };
};

module.exports = IntervalTree;

},{"./classes/node":"node_modules/flatten-interval-tree/classes/node.js","./utils/constants":"node_modules/flatten-interval-tree/utils/constants.js"}],"node_modules/flatten-js/data_structures/planar_set.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 3/12/2017.
 */

"use strict";

// require("babel-polyfill");
let IntervalTree = require('flatten-interval-tree');
module.exports = function (Flatten) {
  /**
   * Class representing a planar set - a generic container with ability to keep and retrieve shapes and
   * perform spatial queries. Planar set is an extension of Set container, so it supports
   * Set properties and methods
   */
  Flatten.PlanarSet = class PlanarSet extends Set {
    /**
     * Create new empty instance of PlanarSet
     */
    constructor() {
      super();
      this.index = new IntervalTree();
    }

    /**
     * Add new shape to planar set and to its spatial index.<br/>
     * If shape already exist, it will not be added again.
     * This happens with no error, it is possible to use <i>size</i> property to check if
     * a shape was actually added.<br/>
     * Method returns planar set object updated and may be chained
     * @param {Shape} shape - shape to be added, should have valid <i>box</i> property
     * @returns {PlanarSet}
     */
    add(shape) {
      let size = this.size;
      super.add(shape);
      // size not changed - item not added, probably trying to add same item twice
      if (this.size > size) {
        let node = this.index.insert(shape.box, shape);
      }
      return this; // in accordance to Set.add interface
    }

    /**
     * Delete shape from planar set. Returns true if shape was actually deleted, false otherwise
     * @param {Shape} shape - shape to be deleted
     * @returns {boolean}
     */
    delete(shape) {
      let deleted = super.delete(shape);
      if (deleted) {
        this.index.remove(shape.box, shape);
      }
      return deleted;
    }

    /**
     * Clear planar set
     */
    clear() {
      super.clear();
      this.index = new IntervalTree();
    }

    /**
     * 2d range search in planar set.<br/>
     * Returns array of all shapes in planar set which bounding box is intersected with query box
     * @param {Box} box - query box
     * @returns {Shapes[]}
     */
    search(box) {
      let resp = this.index.search(box);
      return resp;
    }

    /**
     * Point location test. Returns array of shapes which contains given point
     * @param {Point} point - query point
     * @returns {Array}
     */
    hit(point) {
      let box = new Flatten.Box(point.x - 1, point.y - 1, point.x + 1, point.y + 1);
      let resp = this.index.search(box);
      return resp.filter(shape => point.on(shape));
    }

    /**
     * Returns svg string to draw all shapes in planar set
     * @returns {String}
     */
    svg() {
      let svgcontent = [...this].reduce((acc, shape) => acc + shape.svg(), "");
      return svgcontent;
    }
  };
};
},{"flatten-interval-tree":"node_modules/flatten-interval-tree/index.js"}],"node_modules/flatten-js/classes/point.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 2/18/2017.
 */

/**
 *
 * @param Flatten
 */
module.exports = function (Flatten) {
  /**
   *
   * Class representing a point
   * @type {Point}
   */
  Flatten.Point = class Point {
    /**
     * Point may be constructed by two numbers, or by array of two numbers
     * @param {number} x - x-coordinate (float number)
     * @param {number} y - y-coordinate (float number)
     */
    constructor(...args) {
      /**
       * x-coordinate (float number)
       * @type {number}
       */
      this.x = 0;
      /**
       * y-coordinate (float number)
       * @type {number}
       */
      this.y = 0;
      if (args.length === 0) {
        return;
      }
      if (args.length === 1 && args[0] instanceof Array && args[0].length === 2) {
        let arr = args[0];
        if (typeof arr[0] == "number" && typeof arr[1] == "number") {
          this.x = arr[0];
          this.y = arr[1];
          return;
        }
      }
      if (args.length === 1 && args[0] instanceof Object && args[0].name === "point") {
        let {
          x: x,
          y: y
        } = args[0];
        this.x = x;
        this.y = y;
        return;
      }
      if (args.length === 2) {
        if (typeof args[0] == "number" && typeof args[1] == "number") {
          this.x = args[0];
          this.y = args[1];
          return;
        }
      }
      throw Flatten.Errors.ILLEGAL_PARAMETERS;
    }

    /**
     * Returns bounding box of a point
     * @returns {Box}
     */
    get box() {
      return new Flatten.Box(this.x, this.y, this.x, this.y);
    }

    /**
     * Method clone returns new copied instance of point
     * @returns {Point}
     */
    clone() {
      return new Flatten.Point(this.x, this.y);
    }
    get vertices() {
      return [this.clone()];
    }

    /**
     * Returns true if points are equal up to [Flatten.Utils.DP_TOL]{@link DP_TOL} tolerance
     * @param {Point} pt Query point
     * @returns {boolean}
     */
    equalTo(pt) {
      return Flatten.Utils.EQ(this.x, pt.x) && Flatten.Utils.EQ(this.y, pt.y);
    }

    /**
     * Defines predicate "less than" between points. Returns true if the point is less than query points, false otherwise <br/>
     * By definition point1 < point2 if {point1.y < point2.y || point1.y == point2.y && point1.x < point2.y <br/>
     * Numeric values compared with [Flatten.Utils.DP_TOL]{@link DP_TOL} tolerance
     * @param {Point} pt Query point
     * @returns {boolean}
     */
    lessThan(pt) {
      if (Flatten.Utils.LT(this.y, pt.y)) return true;
      if (Flatten.Utils.EQ(this.y, pt.y) && Flatten.Utils.LT(this.x, pt.x)) return true;
      return false;
    }

    /**
     * Returns new point rotated by given angle around given center point.
     * If center point is omitted, rotates around zero point (0,0).
     * Positive value of angle defines rotation in counter clockwise direction,
     * negative angle defines rotation in clockwise clockwise direction
     * @param {number} angle - angle in radians
     * @param {Point} [center=(0,0)] center
     * @returns {Point}
     */
    rotate(angle, center = {
      x: 0,
      y: 0
    }) {
      var x_rot = center.x + (this.x - center.x) * Math.cos(angle) - (this.y - center.y) * Math.sin(angle);
      var y_rot = center.y + (this.x - center.x) * Math.sin(angle) + (this.y - center.y) * Math.cos(angle);
      return new Flatten.Point(x_rot, y_rot);
    }

    /**
     * Returns new point translated by given vector.
     * Translation vector may by also defined by a pair of numbers.
     * @param {Vector} vector - Translation vector defined as Flatten.Vector or
     * @param {number|number} - Translation vector defined as pair of numbers
     * @returns {Point}
     */
    translate(...args) {
      if (args.length == 1 && args[0] instanceof Flatten.Vector) {
        return new Flatten.Point(this.x + args[0].x, this.y + args[0].y);
      }
      if (args.length == 2 && typeof args[0] == "number" && typeof args[1] == "number") {
        return new Flatten.Point(this.x + args[0], this.y + args[1]);
      }
      throw Flatten.Errors.ILLEGAL_PARAMETERS;
    }

    /**
     * Return new point transformed by affine transformation matrix m
     * @param {Matrix} m - affine transformation matrix (a,b,c,d,tx,ty)
     * @returns {Point}
     */
    transform(m) {
      // let [x,y] = m.transform([this.x,this.y]);
      return new Flatten.Point(m.transform([this.x, this.y]));
    }

    /**
     * Returns projection point on given line
     * @param {Line} line Line this point be projected on
     * @returns {Point}
     */
    projectionOn(line) {
      if (this.equalTo(line.pt))
        // this point equal to line anchor point
        return this.clone();
      let vec = new Flatten.Vector(this, line.pt);
      if (Flatten.Utils.EQ_0(vec.cross(line.norm)))
        // vector to point from anchor point collinear to normal vector
        return line.pt.clone();
      let dist = vec.dot(line.norm); // signed distance
      let proj_vec = line.norm.multiply(dist);
      return this.translate(proj_vec);
    }

    /**
     * Returns true if point belongs to the "left" semi-plane, which means, point belongs to the same semi plane where line normal vector points to
     * Return false if point belongs to the "right" semi-plane or to the line itself
     * @param {Line} line Query line
     * @returns {boolean}
     */
    leftTo(line) {
      let vec = new Flatten.Vector(line.pt, this);
      let onLeftSemiPlane = Flatten.Utils.GT(vec.dot(line.norm), 0);
      return onLeftSemiPlane;
    }

    /**
     * Calculate distance and shortest segment from point to shape and return as array [distance, shortest segment]
     * @param {Shape} shape Shape of the one of supported types Point, Line, Circle, Segment, Arc, Polygon or Planar Set
     * @returns {number} distance from point to shape
     * @returns {Segment} shortest segment between point and shape (started at point, ended at shape)
     */
    distanceTo(shape) {
      let {
        Distance: Distance
      } = Flatten;
      if (shape instanceof Point) {
        let dx = shape.x - this.x;
        let dy = shape.y - this.y;
        return [Math.sqrt(dx * dx + dy * dy), new Flatten.Segment(this, shape)];
      }
      if (shape instanceof Flatten.Line) {
        return Distance.point2line(this, shape);
      }
      if (shape instanceof Flatten.Circle) {
        return Distance.point2circle(this, shape);
      }
      if (shape instanceof Flatten.Segment) {
        return Distance.point2segment(this, shape);
      }
      if (shape instanceof Flatten.Arc) {
        // let [dist, ...rest] = Distance.point2arc(this, shape);
        // return dist;
        return Distance.point2arc(this, shape);
      }
      if (shape instanceof Flatten.Polygon) {
        // let [dist, ...rest] = Distance.point2polygon(this, shape);
        // return dist;
        return Distance.point2polygon(this, shape);
      }
      if (shape instanceof Flatten.PlanarSet) {
        return Distance.shape2planarSet(this, shape);
      }
    }

    /**
     * Returns true if point is on a shape, false otherwise
     * @param {Shape} shape Shape of the one of supported types Point, Line, Circle, Segment, Arc, Polygon
     * @returns {boolean}
     */
    on(shape) {
      if (shape instanceof Flatten.Point) {
        return this.equalTo(shape);
      }
      if (shape instanceof Flatten.Line) {
        return shape.contains(this);
      }
      if (shape instanceof Flatten.Circle) {
        return shape.contains(this);
      }
      if (shape instanceof Flatten.Segment) {
        return shape.contains(this);
      }
      if (shape instanceof Flatten.Arc) {
        return shape.contains(this);
      }
      if (shape instanceof Flatten.Polygon) {
        return shape.contains(this);
      }
    }

    /**
     * Return string to draw point in svg as circle with radius "r" <br/>
     * Accept any valid attributes of svg elements as svg object
     * Defaults attribues are: <br/>
     * {
     *    r:"3",
     *    stroke:"black",
     *    strokeWidth:"1",
     *    fill:"red"
     * }
     * @param {Object} attrs - Any valid attributes of svg circle element, like "r", "stroke", "strokeWidth", "fill"
     * @returns {String}
     */
    svg(attrs = {}) {
      let {
        r: r,
        stroke: stroke,
        strokeWidth: strokeWidth,
        fill: fill,
        id: id,
        className: className
      } = attrs;
      // let rest_str = Object.keys(rest).reduce( (acc, key) => acc += ` ${key}="${rest[key]}"`, "");
      let id_str = id && id.length > 0 ? "id=\"".concat(id, "\"") : "";
      let class_str = className && className.length > 0 ? "class=\"".concat(className, "\"") : "";
      return "\n<circle cx=\"".concat(this.x, "\" cy=\"").concat(this.y, "\" r=\"").concat(r || 3, "\" stroke=\"").concat(stroke || "black", "\" stroke-width=\"").concat(strokeWidth || 1, "\" fill=\"").concat(fill || "red", "\" ").concat(id_str, " ").concat(class_str, " />");
    }

    /**
     * This method returns an object that defines how data will be
     * serialized when called JSON.stringify() method
     * @returns {Object}
     */
    toJSON() {
      return Object.assign({}, this, {
        name: "point"
      });
    }
  };

  /**
   * Function to create point equivalent to "new" constructor
   * @param args
   */
  Flatten.point = (...args) => new Flatten.Point(...args);
};
},{}],"node_modules/flatten-js/classes/vector.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 2/19/2017.
 */

"use strict";

module.exports = function (Flatten) {
  /**
   * Class representing a vector
   * @type {Vector}
   */
  Flatten.Vector = class Vector {
    /**
     * Vector may be constructed by two points, or by two float numbers,
     * or by array of two numbers
     * @param {Point} ps - start point
     * @param {Point} pe - end point
     */
    constructor(...args) {
      /**
       * x-coordinate of a vector (float number)
       * @type {number}
       */
      this.x = 0;
      /**
       * y-coordinate of a vector (float number)
       * @type {number}
       */
      this.y = 0;

      /* return zero vector */
      if (args.length === 0) {
        return;
      }
      if (args.length === 1 && args[0] instanceof Array && args[0].length === 2) {
        let arr = args[0];
        if (typeof arr[0] == "number" && typeof arr[1] == "number") {
          this.x = arr[0];
          this.y = arr[1];
          return;
        }
      }
      if (args.length === 1 && args[0] instanceof Object && args[0].name === "vector") {
        let {
          x: x,
          y: y
        } = args[0];
        this.x = x;
        this.y = y;
        return;
      }
      if (args.length === 2) {
        let a1 = args[0];
        let a2 = args[1];
        if (typeof a1 == "number" && typeof a2 == "number") {
          this.x = a1;
          this.y = a2;
          return;
        }
        if (a1 instanceof Flatten.Point && a2 instanceof Flatten.Point) {
          this.x = a2.x - a1.x;
          this.y = a2.y - a1.y;
          return;
        }
      }
      throw Flatten.Errors.ILLEGAL_PARAMETERS;
    }

    /**
     * Method clone returns new instance of Vector
     * @returns {Vector}
     */
    clone() {
      return new Vector(this.x, this.y);
    }

    /**
     * Slope of the vector in radians from 0 to 2PI
     * @returns {number}
     */
    get slope() {
      let angle = Math.atan2(this.y, this.x);
      if (angle < 0) angle = 2 * Math.PI + angle;
      return angle;
    }

    /**
     * Length of vector
     * @returns {number}
     */
    get length() {
      return Math.sqrt(this.dot(this));
    }

    /**
     * Returns true if vectors are equal up to [DP_TOL]{@link http://localhost:63342/flatten-js/docs/global.html#DP_TOL}
     * tolerance
     * @param {Vector} v
     * @returns {boolean}
     */
    equalTo(v) {
      return Flatten.Utils.EQ(this.x, v.x) && Flatten.Utils.EQ(this.y, v.y);
    }

    /**
     * Returns new vector multiplied by scalar
     * @param {number} scalar
     * @returns {Vector}
     */
    multiply(scalar) {
      return new Vector(scalar * this.x, scalar * this.y);
    }

    /**
     * Returns scalar product (dot product) of two vectors <br/>
     * <code>dot_product = (this * v)</code>
     * @param {Vector} v Other vector
     * @returns {number}
     */
    dot(v) {
      return this.x * v.x + this.y * v.y;
    }

    /**
     * Returns vector product (cross product) of two vectors <br/>
     * <code>cross_product = (this x v)</code>
     * @param {Vector} v Other vector
     * @returns {number}
     */
    cross(v) {
      return this.x * v.y - this.y * v.x;
    }

    /**
     * Returns unit vector.<br/>
     * Throw error if given vector has zero length
     * @returns {Vector}
     */
    normalize() {
      if (!Flatten.Utils.EQ_0(this.length)) {
        return new Vector(this.x / this.length, this.y / this.length);
      }
      throw Flatten.Errors.ZERO_DIVISION;
    }

    /**
     * Returns new vector rotated by given angle,
     * positive angle defines rotation in counter clockwise direction,
     * negative - in clockwise direction
     * @param {number} angle - Angle in radians
     * @returns {Vector}
     */
    rotate(angle) {
      let point = new Flatten.Point(this.x, this.y);
      let rpoint = point.rotate(angle);
      return new Flatten.Vector(rpoint.x, rpoint.y);
    }

    /**
     * Returns vector rotated 90 degrees counter clockwise
     * @returns {Vector}
     */
    rotate90CCW() {
      return new Flatten.Vector(-this.y, this.x);
    }
    /**
     * Returns vector rotated 90 degrees clockwise
     * @returns {Vector}
     */
    rotate90CW() {
      return new Flatten.Vector(this.y, -this.x);
    }
    /**
     * Return inverted vector
     * @returns {Vector}
     */
    invert() {
      return new Flatten.Vector(-this.x, -this.y);
    }

    /**
     * Return result of addition of other vector to this vector as a new vector
     * @param {Vector} v Other vector
     * @returns {Vector}
     */
    add(v) {
      return new Flatten.Vector(this.x + v.x, this.y + v.y);
    }

    /**
     * Return result of subtraction of other vector from current vector as a new vector
     * @param {Vector} v Another vector
     * @returns {Vector}
     */
    subtract(v) {
      return new Flatten.Vector(this.x - v.x, this.y - v.y);
    }

    /**
     * Return angle between this vector and other vector. <br/>
     * Angle is measured from 0 to 2*PI in the counter clockwise direction
     * from current vector to other.
     * @param {Vector} v Another vector
     * @returns {number}
     */
    angleTo(v) {
      let norm1 = this.normalize();
      let norm2 = v.normalize();
      let angle = Math.atan2(norm1.cross(norm2), norm1.dot(norm2));
      if (angle < 0) angle += 2 * Math.PI;
      return angle;
    }

    /**
     * Return vector projection of the current vector on another vector
     * @param {Vector} v Another vector
     * @returns {Vector}
     */
    projectionOn(v) {
      let n = v.normalize();
      let d = this.dot(n);
      return n.multiply(d);
    }

    /**
     * This method returns an object that defines how data will be
     * serialized when called JSON.stringify() method
     * @returns {Object}
     */
    toJSON() {
      return Object.assign({}, this, {
        name: "vector"
      });
    }
  };

  /**
   * Function to create vector equivalent to "new" constructor
   * @param args
   */
  Flatten.vector = (...args) => new Flatten.Vector(...args);
};
},{}],"node_modules/flatten-js/classes/line.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 2/20/2017.
 */
"use strict";

module.exports = function (Flatten) {
  /**
   * Class representing a line
   * @type {Line}
   */
  Flatten.Line = class Line {
    /**
     * Line may be constructed by point and normal vector or by two points that a line passes through
     * @param {Point} pt - point that a line passes through
     * @param {Vector|Point} norm - normal vector to a line or second point a line passes through
     */
    constructor(...args) {
      /**
       * Point a line passes through
       * @type {Point}
       */
      this.pt = new Flatten.Point();
      /**
       * Normal vector to a line <br/>
       * Vector is normalized (length == 1)
       * @type {Vector}
       */
      this.norm = new Flatten.Vector(0, 1);
      if (args.length == 0) {
        return;
      }
      if (args.length == 1 && args[0] instanceof Object && args[0].name === "line") {
        let {
          pt: pt,
          norm: norm
        } = args[0];
        this.pt = new Flatten.Point(pt);
        this.norm = new Flatten.Vector(norm);
        return;
      }
      if (args.length == 2) {
        let a1 = args[0];
        let a2 = args[1];
        if (a1 instanceof Flatten.Point && a2 instanceof Flatten.Point) {
          this.pt = a1;
          this.norm = Line.points2norm(a1, a2);
          return;
        }
        if (a1 instanceof Flatten.Point && a2 instanceof Flatten.Vector) {
          if (Flatten.Utils.EQ_0(a2.x) && Flatten.Utils.EQ_0(a2.y)) {
            throw Flatten.Errors.ILLEGAL_PARAMETERS;
          }
          this.pt = a1.clone();
          this.norm = a2.clone();
          this.norm = this.norm.normalize();
          return;
        }
        if (a1 instanceof Flatten.Vector && a2 instanceof Flatten.Point) {
          if (Flatten.Utils.EQ_0(a1.x) && Flatten.Utils.EQ_0(a1.y)) {
            throw Flatten.Errors.ILLEGAL_PARAMETERS;
          }
          this.pt = a2.clone();
          this.norm = a1.clone();
          this.norm = this.norm.normalize();
          return;
        }
      }
      throw Flatten.Errors.ILLEGAL_PARAMETERS;
    }

    /**
     * Returns cloned new instance of a line
     * @returns {Line}
     */
    clone() {
      return new Flatten.Line(this.pt, this.norm);
    }

    /**
     * Slope of the line - angle in radians between line and axe x from 0 to 2PI
     * @returns {number} - slope of the line
     */
    get slope() {
      let vec = new Flatten.Vector(this.norm.y, -this.norm.x);
      return vec.slope;
    }

    /**
     * Get coefficients [A,B,C] of a standard line equation in the form Ax + By = C
     * @code [A, B, C] = line.standard
     * @returns {number[]} - array of coefficients
     */
    get standard() {
      let A = this.norm.x;
      let B = this.norm.y;
      let C = this.norm.dot(this.pt);
      return [A, B, C];
    }

    /**
     * Return true if parallel or incident to other line
     * @param {Line} other_line - line to check
     * @returns {boolean}
     */
    parallelTo(other_line) {
      return Flatten.Utils.EQ_0(this.norm.cross(other_line.norm));
    }

    /**
     * Returns true if incident to other line
     * @param {Line} other_line - line to check
     * @returns {boolean}
     */
    incidentTo(other_line) {
      return this.parallelTo(other_line) && this.pt.on(other_line);
    }

    /**
     * Returns true if point belongs to line
     * @param {Point} pt Query point
     * @returns {boolean}
     */
    contains(pt) {
      if (this.pt.equalTo(pt)) {
        return true;
      }
      /* Line contains point if vector to point is orthogonal to the line normal vector */
      let vec = new Flatten.Vector(this.pt, pt);
      return Flatten.Utils.EQ_0(this.norm.dot(vec));
    }

    /**
     * Returns array of intersection points
     * @param {Shape} shape - shape to intersect with
     * @returns {Point[]}
     */
    intersect(shape) {
      if (shape instanceof Flatten.Point) {
        return this.contains(shape) ? [shape] : [];
      }
      if (shape instanceof Flatten.Line) {
        return Line.intersectLine2Line(this, shape);
      }
      if (shape instanceof Flatten.Circle) {
        return Line.intersectLine2Circle(this, shape);
      }
      if (shape instanceof Flatten.Segment) {
        return shape.intersect(this);
      }
      if (shape instanceof Flatten.Arc) {
        return Line.intersectLine2Arc(this, shape);
      }
      if (shape instanceof Flatten.Polygon) {
        return Flatten.Polygon.intersectLine2Polygon(this, shape);
      }
    }

    /**
     * Calculate distance and shortest segment from line to shape and returns array [distance, shortest_segment]
     * @param {Shape} shape Shape of the one of the types Point, Circle, Segment, Arc, Polygon
     * @returns {Number}
     * @returns {Segment}
     */
    distanceTo(shape) {
      let {
        Distance: Distance
      } = Flatten;
      if (shape instanceof Flatten.Point) {
        let [distance, shortest_segment] = Distance.point2line(shape, this);
        shortest_segment = shortest_segment.reverse();
        return [distance, shortest_segment];
      }
      if (shape instanceof Flatten.Circle) {
        let [distance, shortest_segment] = Distance.circle2line(shape, this);
        shortest_segment = shortest_segment.reverse();
        return [distance, shortest_segment];
      }
      if (shape instanceof Flatten.Segment) {
        let [distance, shortest_segment] = Distance.segment2line(shape, this);
        return [distance, shortest_segment.reverse()];
      }
      if (shape instanceof Flatten.Arc) {
        let [distance, shortest_segment] = Distance.arc2line(shape, this);
        return [distance, shortest_segment.reverse()];
      }
      if (shape instanceof Flatten.Polygon) {
        let [distance, shortest_segment] = Distance.shape2polygon(this, shape);
        return [distance, shortest_segment];
      }
    }

    /**
     * Return string to draw svg segment representing line inside given box
     * @param {Box} box Box representing drawing area
     * @param {Object} attrs - an object with attributes of svg circle element
     */
    svg(box, attrs = {}) {
      let ip = Line.intersectLine2Box(this, box);
      if (ip.length === 0) return "";
      let ps = ip[0];
      let pe = ip.length == 2 ? ip[1] : ip.find(pt => !pt.equalTo(ps));
      if (pe === undefined) pe = ps;
      let segment = new Flatten.Segment(ps, pe);
      return segment.svg(attrs);
    }

    /**
     * This method returns an object that defines how data will be
     * serialized when called JSON.stringify() method
     * @returns {Object}
     */
    toJSON() {
      return Object.assign({}, this, {
        name: "line"
      });
    }
    static points2norm(pt1, pt2) {
      if (pt1.equalTo(pt2)) {
        throw Flatten.Errors.ILLEGAL_PARAMETERS;
      }
      let vec = new Flatten.Vector(pt1, pt2);
      let unit = vec.normalize();
      return unit.rotate90CCW();
    }
    static intersectLine2Line(line1, line2) {
      let ip = [];
      let [A1, B1, C1] = line1.standard;
      let [A2, B2, C2] = line2.standard;

      /* Cramer's rule */
      let det = A1 * B2 - B1 * A2;
      let detX = C1 * B2 - B1 * C2;
      let detY = A1 * C2 - C1 * A2;
      if (!Flatten.Utils.EQ_0(det)) {
        let new_ip = new Flatten.Point(detX / det, detY / det);
        ip.push(new_ip);
      }
      return ip;
    }
    static intersectLine2Circle(line, circle) {
      let ip = [];
      let prj = circle.pc.projectionOn(line); // projection of circle center on line
      let dist = circle.pc.distanceTo(prj)[0]; // distance from circle center to projection

      if (Flatten.Utils.EQ(dist, circle.r)) {
        // line tangent to circle - return single intersection point
        ip.push(prj);
      } else if (Flatten.Utils.LT(dist, circle.r)) {
        // return two intersection points
        let delta = Math.sqrt(circle.r * circle.r - dist * dist);
        let v_trans, pt;
        v_trans = line.norm.rotate90CCW().multiply(delta);
        pt = prj.translate(v_trans);
        ip.push(pt);
        v_trans = line.norm.rotate90CW().multiply(delta);
        pt = prj.translate(v_trans);
        ip.push(pt);
      }
      return ip;
    }
    static intersectLine2Box(line, box) {
      let pts = [new Flatten.Point(box.xmin, box.ymin), new Flatten.Point(box.xmax, box.ymin), new Flatten.Point(box.xmax, box.ymax), new Flatten.Point(box.xmin, box.ymax)];
      let segs = [new Flatten.Segment(pts[0], pts[1]), new Flatten.Segment(pts[1], pts[2]), new Flatten.Segment(pts[2], pts[3]), new Flatten.Segment(pts[3], pts[0])];
      let ips = [];
      for (let seg of segs) {
        let ips_tmp = seg.intersect(line);
        for (let ip of ips_tmp) {
          ips.push(ip);
        }
      }
      ;
      return ips;
    }
    static intersectLine2Arc(line, arc) {
      let ip = [];
      if (Line.intersectLine2Box(line, arc.box).length == 0) {
        return ip;
      }
      let circle = new Flatten.Circle(arc.pc, arc.r);
      let ip_tmp = line.intersect(circle);
      for (let pt of ip_tmp) {
        if (pt.on(arc)) {
          ip.push(pt);
        }
      }
      return ip;
    }
  };

  /**
   * Function to create line equivalent to "new" constructor
   * @param args
   */
  Flatten.line = (...args) => new Flatten.Line(...args);
};
},{}],"node_modules/flatten-js/classes/circle.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 3/6/2017.
 */

"use strict";

module.exports = function (Flatten) {
  let {
    Arc: Arc,
    vector: vector
  } = Flatten;
  /**
   * Class representing a circle
   * @type {Circle}
   */
  Flatten.Circle = class Circle {
    /**
     *
     * @param {Point} pc - circle center point
     * @param {number} r - circle radius
     */
    constructor(...args) {
      /**
       * Circle center
       * @type {Point}
       */
      this.pc = new Flatten.Point();
      /**
       * Circle radius
       * @type {number}
       */
      this.r = 1;
      if (args.length == 1 && args[0] instanceof Object && args[0].name === "circle") {
        let {
          pc: pc,
          r: r
        } = args[0];
        this.pc = new Flatten.Point(pc);
        this.r = r;
        return;
      } else {
        let [pc, r] = [...args];
        if (pc && pc instanceof Flatten.Point) this.pc = pc.clone();
        if (r !== undefined) this.r = r;
        return;
      }
      throw Flatten.Errors.ILLEGAL_PARAMETERS;
    }

    /**
     * Method clone returns new instance of a Circle
     * @returns {Circle}
     */
    clone() {
      return new Flatten.Circle(this.pc.clone(), this.r);
    }

    /**
     * Circle center
     * @returns {Point}
     */
    get center() {
      return this.pc;
    }

    /**
     * Circle bounding box
     * @returns {Box}
     */
    get box() {
      return new Flatten.Box(this.pc.x - this.r, this.pc.y - this.r, this.pc.x + this.r, this.pc.y + this.r);
    }

    /**
     * Return true if circle contains point
     * @param {Point} pt - test point
     * @returns {boolean}
     */
    contains(pt) {
      return Flatten.Utils.LE(pt.distanceTo(this.center)[0], this.r);
    }

    /**
     * Transform circle to closed arc
     * @param {boolean} counterclockwise
     * @returns {Arc}
     */
    toArc(counterclockwise = true) {
      return new Flatten.Arc(this.center, this.r, Math.PI, -Math.PI, counterclockwise);
    }

    /**
     * Returns array of intersection points between circle and other shape
     * @param {Shape} shape Shape of the one of supported types
     * @returns {Point[]}
     */
    intersect(shape) {
      if (shape instanceof Flatten.Point) {
        return this.contains(shape) ? [shape] : [];
      }
      if (shape instanceof Flatten.Line) {
        return shape.intersect(this);
      }
      if (shape instanceof Flatten.Segment) {
        return shape.intersect(this);
      }
      if (shape instanceof Flatten.Circle) {
        return Circle.intersectCirle2Circle(this, shape);
      }
      if (shape instanceof Flatten.Arc) {
        return shape.intersect(this);
      }
      if (shape instanceof Flatten.Polygon) {
        return Flatten.Polygon.intersectShape2Polygon(this, shape);
      }
    }

    /**
     * Calculate distance and shortest segment from circle to shape and return array [distance, shortest segment]
     * @param {Shape} shape Shape of the one of supported types Point, Line, Circle, Segment, Arc, Polygon or Planar Set
     * @returns {number} distance from circle to shape
     * @returns {Segment} shortest segment between circle and shape (started at circle, ended at shape)
       */
    distanceTo(shape) {
      let {
        Distance: Distance
      } = Flatten;
      let {
        point2circle: point2circle,
        circle2circle: circle2circle,
        circle2line: circle2line,
        segment2circle: segment2circle,
        arc2circle: arc2circle
      } = Distance;
      if (shape instanceof Flatten.Point) {
        let [distance, shortest_segment] = point2circle(shape, this);
        shortest_segment = shortest_segment.reverse();
        return [distance, shortest_segment];
      }
      if (shape instanceof Flatten.Circle) {
        let [distance, shortest_segment] = circle2circle(this, shape);
        return [distance, shortest_segment];
      }
      if (shape instanceof Flatten.Line) {
        let [distance, shortest_segment] = circle2line(this, shape);
        return [distance, shortest_segment];
      }
      if (shape instanceof Flatten.Segment) {
        let [distance, shortest_segment] = segment2circle(shape, this);
        shortest_segment = shortest_segment.reverse();
        return [distance, shortest_segment];
      }
      if (shape instanceof Flatten.Arc) {
        let [distance, shortest_segment] = arc2circle(shape, this);
        shortest_segment = shortest_segment.reverse();
        return [distance, shortest_segment];
      }
      if (shape instanceof Flatten.Polygon) {
        let [distance, shortest_segment] = Distance.shape2polygon(this, shape);
        return [distance, shortest_segment];
      }
      if (shape instanceof Flatten.PlanarSet) {
        let [dist, shortest_segment] = Distance.shape2planarSet(this, shape);
        return [dist, shortest_segment];
      }
    }
    static intersectCirle2Circle(circle1, circle2) {
      let ip = [];
      if (circle1.box.not_intersect(circle2.box)) {
        return ip;
      }
      let vec = new Flatten.Vector(circle1.pc, circle2.pc);
      let r1 = circle1.r;
      let r2 = circle2.r;

      // Degenerated circle
      if (Flatten.Utils.EQ_0(r1) || Flatten.Utils.EQ_0(r2)) return ip;

      // In case of equal circles return one leftmost point
      if (Flatten.Utils.EQ_0(vec.x) && Flatten.Utils.EQ_0(vec.y) && Flatten.Utils.EQ(r1, r2)) {
        ip.push(circle1.pc.translate(-r1, 0));
        return ip;
      }
      let dist = circle1.pc.distanceTo(circle2.pc)[0];
      if (Flatten.Utils.GT(dist, r1 + r2))
        // circles too far, no intersections
        return ip;
      if (Flatten.Utils.LT(dist, Math.abs(r1 - r2)))
        // one circle is contained within another, no intersections
        return ip;

      // Normalize vector.
      vec.x /= dist;
      vec.y /= dist;
      let pt;

      // Case of touching from outside or from inside - single intersection point
      // TODO: check this specifically not sure if correct
      if (Flatten.Utils.EQ(dist, r1 + r2) || Flatten.Utils.EQ(dist, Math.abs(r1 - r2))) {
        pt = circle1.pc.translate(r1 * vec.x, r1 * vec.y);
        ip.push(pt);
        return ip;
      }

      // Case of two intersection points

      // Distance from first center to center of common chord:
      //   a = (r1^2 - r2^2 + d^2) / 2d
      // Separate for better accuracy
      let a = r1 * r1 / (2 * dist) - r2 * r2 / (2 * dist) + dist / 2;
      let mid_pt = circle1.pc.translate(a * vec.x, a * vec.y);
      let h = Math.sqrt(r1 * r1 - a * a);
      // let norm;

      // norm = vec.rotate90CCW().multiply(h);
      pt = mid_pt.translate(vec.rotate90CCW().multiply(h));
      ip.push(pt);

      // norm = vec.rotate90CW();
      pt = mid_pt.translate(vec.rotate90CW().multiply(h));
      ip.push(pt);
      return ip;
    }

    /**
     * Return string to draw circle in svg
     * @param {Object} attrs - an object with attributes of svg circle element,
     * like "stroke", "strokeWidth", "fill" <br/>
     * Defaults are stroke:"black", strokeWidth:"1", fill:"none"
     * @returns {string}
     */
    svg(attrs = {}) {
      let {
        stroke: stroke,
        strokeWidth: strokeWidth,
        fill: fill,
        fillOpacity: fillOpacity,
        id: id,
        className: className
      } = attrs;
      // let rest_str = Object.keys(rest).reduce( (acc, key) => acc += ` ${key}="${rest[key]}"`, "");
      let id_str = id && id.length > 0 ? "id=\"".concat(id, "\"") : "";
      let class_str = className && className.length > 0 ? "class=\"".concat(className, "\"") : "";
      return "\n<circle cx=\"".concat(this.pc.x, "\" cy=\"").concat(this.pc.y, "\" r=\"").concat(this.r, "\" stroke=\"").concat(stroke || "black", "\" stroke-width=\"").concat(strokeWidth || 1, "\" fill=\"").concat(fill || "none", "\" fill-opacity=\"").concat(fillOpacity || 1.0, "\" ").concat(id_str, " ").concat(class_str, " />");
    }

    /**
     * This method returns an object that defines how data will be
     * serialized when called JSON.stringify() method
     * @returns {Object}
     */
    toJSON() {
      return Object.assign({}, this, {
        name: "circle"
      });
    }
  };

  /**
   * Shortcut to create new circle
   * @param args
   */
  Flatten.circle = (...args) => new Flatten.Circle(...args);
};
},{}],"node_modules/flatten-js/classes/segment.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 3/10/2017.
 */

"use strict";

module.exports = function (Flatten) {
  /**
   * Class representing a segment
   * @type {Segment}
   */
  Flatten.Segment = class Segment {
    /**
     *
     * @param {Point} ps - start point
     * @param {Point} pe - end point
     */
    constructor(...args) {
      /**
       * Start point
       * @type {Point}
       */
      this.ps = new Flatten.Point();
      /**
       * End Point
       * @type {Point}
       */
      this.pe = new Flatten.Point();
      if (args.length == 0) {
        return;
      }
      if (args.length == 1 && args[0] instanceof Array && args[0].length == 4) {
        let coords = args[0];
        this.ps = new Flatten.Point(coords[0], coords[1]);
        this.pe = new Flatten.Point(coords[2], coords[3]);
        return;
      }
      if (args.length == 1 && args[0] instanceof Object && args[0].name === "segment") {
        let {
          ps: ps,
          pe: pe
        } = args[0];
        this.ps = new Flatten.Point(ps.x, ps.y);
        this.pe = new Flatten.Point(pe.x, pe.y);
        return;
      }
      if (args.length == 2 && args[0] instanceof Flatten.Point && args[1] instanceof Flatten.Point) {
        this.ps = args[0].clone();
        this.pe = args[1].clone();
        return;
      }
      if (args.length == 4) {
        this.ps = new Flatten.Point(args[0], args[1]);
        this.pe = new Flatten.Point(args[2], args[3]);
        return;
      }
      throw Flatten.Errors.ILLEGAL_PARAMETERS;
    }

    /**
     * Method clone copies segment and returns a new instance
     * @returns {Segment}
     */
    clone() {
      return new Flatten.Segment(this.start, this.end);
    }

    /**
     * Start point
     * @returns {Point}
     */
    get start() {
      return this.ps;
    }

    /**
     * End point
     * @returns {Point}
     */
    get end() {
      return this.pe;
    }

    /**
     * Returns array of start and end point
     * @returns [Point,Point]
     */
    get vertices() {
      return [this.ps.clone(), this.pe.clone()];
    }

    /**
     * Length of a segment
     * @returns {number}
     */
    get length() {
      return this.start.distanceTo(this.end)[0];
    }

    /**
     * Slope of the line - angle to axe x in radians from 0 to 2PI
     * @returns {number}
     */
    get slope() {
      let vec = new Flatten.Vector(this.start, this.end);
      return vec.slope;
    }

    /**
     * Bounding box
     * @returns {Box}
     */
    get box() {
      return new Flatten.Box(Math.min(this.start.x, this.end.x), Math.min(this.start.y, this.end.y), Math.max(this.start.x, this.end.x), Math.max(this.start.y, this.end.y));
    }

    /**
     * Returns true if equals to query segment, false otherwise
     * @param {Seg} seg - query segment
     * @returns {boolean}
     */
    equalTo(seg) {
      return this.ps.equalTo(seg.ps) && this.pe.equalTo(seg.pe);
    }

    /**
     * Returns true if segment contains point
     * @param {Point} pt Query point
     * @returns {boolean}
     */
    contains(pt) {
      return Flatten.Utils.EQ_0(this.distanceToPoint(pt));
    }

    /**
     * Returns array of intersection points between segment and other shape
     * @param {Shape} shape - Shape of the one of supported types <br/>
     * @returns {Point[]}
     */
    intersect(shape) {
      if (shape instanceof Flatten.Point) {
        return this.contains(shape) ? [shape] : [];
      }
      if (shape instanceof Flatten.Line) {
        return Segment.intersectSegment2Line(this, shape);
      }
      if (shape instanceof Flatten.Segment) {
        return Segment.intersectSegment2Segment(this, shape);
      }
      if (shape instanceof Flatten.Circle) {
        return Segment.intersectSegment2Circle(this, shape);
      }
      if (shape instanceof Flatten.Arc) {
        return Segment.intersectSegment2Arc(this, shape);
      }
      if (shape instanceof Flatten.Polygon) {
        return Flatten.Polygon.intersectShape2Polygon(this, shape);
      }
    }

    /**
     * Calculate distance and shortest segment from segment to shape and return as array [distance, shortest segment]
     * @param {Shape} shape Shape of the one of supported types Point, Line, Circle, Segment, Arc, Polygon or Planar Set
     * @returns {number} distance from segment to shape
     * @returns {Segment} shortest segment between segment and shape (started at segment, ended at shape)
     */
    distanceTo(shape) {
      let {
        Distance: Distance
      } = Flatten;
      if (shape instanceof Flatten.Point) {
        let [dist, shortest_segment] = Distance.point2segment(shape, this);
        shortest_segment = shortest_segment.reverse();
        return [dist, shortest_segment];
      }
      if (shape instanceof Flatten.Circle) {
        let [dist, shortest_segment] = Distance.segment2circle(this, shape);
        return [dist, shortest_segment];
      }
      if (shape instanceof Flatten.Line) {
        let [dist, shortest_segment] = Distance.segment2line(this, shape);
        return [dist, shortest_segment];
      }
      if (shape instanceof Flatten.Segment) {
        let [dist, shortest_segment] = Distance.segment2segment(this, shape);
        return [dist, shortest_segment];
      }
      if (shape instanceof Flatten.Arc) {
        let [dist, shortest_segment] = Distance.segment2arc(this, shape);
        return [dist, shortest_segment];
      }
      if (shape instanceof Flatten.Polygon) {
        let [dist, shortest_segment] = Distance.shape2polygon(this, shape);
        return [dist, shortest_segment];
      }
      if (shape instanceof Flatten.PlanarSet) {
        let [dist, shortest_segment] = Distance.shape2planarSet(this, shape);
        return [dist, shortest_segment];
      }
    }

    /**
     * Returns unit vector in the direction from start to end
     * @returns {Vector}
     */
    tangentInStart() {
      let vec = new Flatten.Vector(this.start, this.end);
      return vec.normalize();
    }

    /**
     * Return unit vector in the direction from end to start
     * @returns {Vector}
     */
    tangentInEnd() {
      let vec = new Flatten.Vector(this.end, this.start);
      return vec.normalize();
    }

    /**
     * Returns new segment with swapped start and end points
     * @returns {Segment}
     */
    reverse() {
      return new Segment(this.end, this.start);
    }

    /**
     * When point belongs to segment, return array of two segments split by given point,
     * if point is inside segment. Returns clone of this segment if query point is incident
     * to start or end point of the segment. Returns empty array if point does not belong to segment
     * @param {Point} pt Query point
     * @returns {Segment[]}
     */
    split(pt) {
      if (!this.contains(pt)) return [];
      if (this.start.equalTo(this.end)) return [this.clone()];
      if (this.start.equalTo(pt) || this.end.equalTo(pt)) return [this];
      return [new Flatten.Segment(this.start, pt), new Flatten.Segment(pt, this.end)];
    }

    /**
     * Return middle point of the segment
     * @returns {Point}
     */
    middle() {
      return new Flatten.Point((this.start.x + this.end.x) / 2, (this.start.y + this.end.y) / 2);
    }
    distanceToPoint(pt) {
      let [dist, ...rest] = Flatten.Distance.point2segment(pt, this);
      return dist;
    }
    definiteIntegral(ymin = 0.0) {
      let dx = this.end.x - this.start.x;
      let dy1 = this.start.y - ymin;
      let dy2 = this.end.y - ymin;
      return dx * (dy1 + dy2) / 2;
    }

    /**
     * Returns new segment translated by vector vec
     * @param {Vector} vec
     * @returns {Segment}
     */
    translate(...args) {
      return new Segment(this.ps.translate(...args), this.pe.translate(...args));
    }

    /**
     * Return new segment rotated by given angle around given point
     * If point omitted, rotate around origin (0,0)
     * Positive value of angle defines rotation counter clockwise, negative - clockwise
     * @param {number} angle - rotation angle in radians
     * @param {Point} center - center point, default is (0,0)
     * @returns {Segment}
     */
    rotate(angle = 0, center = new Flatten.Point()) {
      let m = new Flatten.Matrix();
      m = m.translate(center.x, center.y).rotate(angle).translate(-center.x, -center.y);
      return this.transform(m);
    }

    /**
     * Return new segment transformed using affine transformation matrix
     * @param {Matrix} matrix - affine transformation matrix
     * @returns {Segment} - transformed segment
     */
    transform(matrix = new Flatten.Matrix()) {
      return new Segment(this.ps.transform(matrix), this.pe.transform(matrix));
    }

    /**
     * Returns true if segment start is equal to segment end up to DP_TOL
     * @returns {boolean}
     */
    isZeroLength() {
      return this.ps.equalTo(this.pe);
    }
    static intersectSegment2Line(seg, line) {
      let ip = [];

      // Boundary cases
      if (seg.ps.on(line)) {
        ip.push(seg.ps);
      }
      // If both ends lay on line, return two intersection points
      if (seg.pe.on(line) && !seg.isZeroLength()) {
        ip.push(seg.pe);
      }
      if (ip.length > 0) {
        return ip; // done, intersection found
      }

      // If zero-length segment and nothing found, return no intersections
      if (seg.isZeroLength()) {
        return ip;
      }

      // Not a boundary case, check if both points are on the same side and
      // hence there is no intersection
      if (seg.ps.leftTo(line) && seg.pe.leftTo(line) || !seg.ps.leftTo(line) && !seg.pe.leftTo(line)) {
        return ip;
      }

      // Calculate intersection between lines
      let line1 = new Flatten.Line(seg.ps, seg.pe);
      return line1.intersect(line);
    }
    static intersectSegment2Segment(seg1, seg2) {
      let ip = [];

      // quick reject
      if (seg1.box.not_intersect(seg2.box)) {
        return ip;
      }

      // Special case of seg1 zero length
      if (seg1.isZeroLength()) {
        if (seg1.ps.on(seg2)) {
          ip.push(seg1.ps);
        }
        return ip;
      }

      // Special case of seg2 zero length
      if (seg2.isZeroLength()) {
        if (seg2.ps.on(seg1)) {
          ip.push(seg2.ps);
        }
        return ip;
      }

      // Neither seg1 nor seg2 is zero length
      let line1 = new Flatten.Line(seg1.ps, seg1.pe);
      let line2 = new Flatten.Line(seg2.ps, seg2.pe);

      // Check overlapping between segments in case of incidence
      // If segments touching, add one point. If overlapping, add two points
      if (line1.incidentTo(line2)) {
        if (seg1.ps.on(seg2)) {
          ip.push(seg1.ps);
        }
        if (seg1.pe.on(seg2)) {
          ip.push(seg1.pe);
        }
        if (seg2.ps.on(seg1) && !seg2.ps.equalTo(seg1.ps) && !seg2.ps.equalTo(seg1.pe)) {
          ip.push(seg2.ps);
        }
        if (seg2.pe.on(seg1) && !seg2.pe.equalTo(seg1.ps) && !seg2.pe.equalTo(seg1.pe)) {
          ip.push(seg2.pe);
        }
      } else {
        /* not incident - parallel or intersect */
        // Calculate intersection between lines
        let new_ip = line1.intersect(line2);
        if (new_ip.length > 0 && new_ip[0].on(seg1) && new_ip[0].on(seg2)) {
          ip.push(new_ip[0]);
        }
      }
      return ip;
    }
    static intersectSegment2Circle(segment, circle) {
      let ips = [];
      if (segment.box.not_intersect(circle.box)) {
        return ips;
      }

      // Special case of zero length segment
      if (segment.isZeroLength()) {
        let [dist, shortest_segment] = segment.ps.distanceTo(circle.pc);
        if (Flatten.Utils.EQ(dist, circle.r)) {
          ips.push(segment.ps);
        }
        return ips;
      }

      // Non zero-length segment
      let line = new Flatten.Line(segment.ps, segment.pe);
      let ips_tmp = line.intersect(circle);
      for (let ip of ips_tmp) {
        if (ip.on(segment)) {
          ips.push(ip);
        }
      }
      return ips;
    }
    static intersectSegment2Arc(segment, arc) {
      let ip = [];
      if (segment.box.not_intersect(arc.box)) {
        return ip;
      }

      // Special case of zero-length segment
      if (segment.isZeroLength()) {
        if (segment.ps.on(arc)) {
          ip.push(segment.ps);
        }
        return ip;
      }

      // Non-zero length segment
      let line = new Flatten.Line(segment.ps, segment.pe);
      let circle = new Flatten.Circle(arc.pc, arc.r);
      let ip_tmp = line.intersect(circle);
      for (let pt of ip_tmp) {
        if (pt.on(segment) && pt.on(arc)) {
          ip.push(pt);
        }
      }
      return ip;
    }

    /**
     * Return string to draw segment in svg
     * @param {Object} attrs - an object with attributes for svg path element,
     * like "stroke", "strokeWidth" <br/>
     * Defaults are stroke:"black", strokeWidth:"1"
     * @returns {string}
     */
    svg(attrs = {}) {
      let {
        stroke: stroke,
        strokeWidth: strokeWidth,
        id: id,
        className: className
      } = attrs;
      // let rest_str = Object.keys(rest).reduce( (acc, key) => acc += ` ${key}="${rest[key]}"`, "");
      let id_str = id && id.length > 0 ? "id=\"".concat(id, "\"") : "";
      let class_str = className && className.length > 0 ? "class=\"".concat(className, "\"") : "";
      return "\n<line x1=\"".concat(this.start.x, "\" y1=\"").concat(this.start.y, "\" x2=\"").concat(this.end.x, "\" y2=\"").concat(this.end.y, "\" stroke=\"").concat(stroke || "black", "\" stroke-width=\"").concat(strokeWidth || 1, "\" ").concat(id_str, " ").concat(class_str, " />");
    }

    /**
     * This method returns an object that defines how data will be
     * serialized when called JSON.stringify() method
     * @returns {Object}
     */
    toJSON() {
      return Object.assign({}, this, {
        name: "segment"
      });
    }
  };

  /**
   * Shortcut method to create new segment
   */
  Flatten.segment = (...args) => new Flatten.Segment(...args);
};
},{}],"node_modules/flatten-js/classes/arc.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 3/10/2017.
 */

"use strict";

module.exports = function (Flatten) {
  /**
   * Class representing a circular arc
   * @type {Arc}
   */
  Flatten.Arc = class Arc {
    /**
     *
     * @param {Point} pc - arc center
     * @param {number} r - arc radius
     * @param {number} startAngle - start angle in radians from 0 to 2*PI
     * @param {number} endAngle - end angle in radians from 0 to 2*PI
     * @param {boolean} counterClockwise - arc direction, true - clockwise, false - counter clockwise
     */
    constructor(...args) {
      /**
       * Arc center
       * @type {Point}
       */
      this.pc = new Flatten.Point();
      /**
       * Arc radius
       * @type {number}
       */
      this.r = 1;
      /**
       * Arc start angle in radians
       * @type {number}
       */
      this.startAngle = 0;
      /**
       * Arc end angle in radians
       * @type {number}
       */
      this.endAngle = 2 * Math.PI;
      /**
       * Arc orientation
       * @type {boolean}
       */
      this.counterClockwise = Flatten.CCW;
      if (args.length == 0) return;
      if (args.length == 1 && args[0] instanceof Object && args[0].name === "arc") {
        let {
          pc: pc,
          r: r,
          startAngle: startAngle,
          endAngle: endAngle,
          counterClockwise: counterClockwise
        } = args[0];
        this.pc = new Flatten.Point(pc.x, pc.y);
        this.r = r;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.counterClockwise = counterClockwise;
        return;
      } else {
        let [pc, r, startAngle, endAngle, counterClockwise] = [...args];
        if (pc && pc instanceof Flatten.Point) this.pc = pc.clone();
        if (r !== undefined) this.r = r;
        if (startAngle !== undefined) this.startAngle = startAngle;
        if (endAngle !== undefined) this.endAngle = endAngle;
        if (counterClockwise !== undefined) this.counterClockwise = counterClockwise;
        return;
      }
      throw Flatten.Errors.ILLEGAL_PARAMETERS;
    }

    /**
     * Return new instance of arc
     * @returns {Arc}
     */
    clone() {
      return new Flatten.Arc(this.pc.clone(), this.r, this.startAngle, this.endAngle, this.counterClockwise);
    }

    /**
     * Get sweep angle in radians. Sweep angle is non-negative number from 0 to 2*PI
     * @returns {number}
     */
    get sweep() {
      if (Flatten.Utils.EQ(this.startAngle, this.endAngle)) return 0.0;
      if (Flatten.Utils.EQ(Math.abs(this.startAngle - this.endAngle), Flatten.PIx2)) {
        return Flatten.PIx2;
      }
      let sweep;
      if (this.counterClockwise) {
        sweep = Flatten.Utils.GT(this.endAngle, this.startAngle) ? this.endAngle - this.startAngle : this.endAngle - this.startAngle + Flatten.PIx2;
      } else {
        sweep = Flatten.Utils.GT(this.startAngle, this.endAngle) ? this.startAngle - this.endAngle : this.startAngle - this.endAngle + Flatten.PIx2;
      }
      if (Flatten.Utils.GT(sweep, Flatten.PIx2)) {
        sweep -= Flatten.PIx2;
      }
      if (Flatten.Utils.LT(sweep, 0)) {
        sweep += Flatten.PIx2;
      }
      return sweep;
    }

    /**
     * Get start point of arc
     * @returns {Point}
     */
    get start() {
      let p0 = new Flatten.Point(this.pc.x + this.r, this.pc.y);
      return p0.rotate(this.startAngle, this.pc);
    }

    /**
     * Get end point of arc
     * @returns {Point}
     */
    get end() {
      let p0 = new Flatten.Point(this.pc.x + this.r, this.pc.y);
      return p0.rotate(this.endAngle, this.pc);
    }

    /**
     * Get center of arc
     * @returns {Point}
     */
    get center() {
      return this.pc.clone();
    }
    get vertices() {
      return [this.start.clone(), this.end.clone()];
    }

    /**
     * Get arc length
     * @returns {number}
     */
    get length() {
      return Math.abs(this.sweep * this.r);
    }

    /**
     * Get bounding box of the arc
     * @returns {Box}
     */
    get box() {
      let func_arcs = this.breakToFunctional();
      let box = func_arcs.reduce((acc, arc) => acc.merge(arc.start.box), new Flatten.Box());
      box = box.merge(this.end.box);
      return box;
    }

    /**
     * Returns true if arc contains point, false otherwise
     * @param {Point} pt - point to test
     * @returns {boolean}
     */
    contains(pt) {
      // first check if  point on circle (pc,r)
      if (!Flatten.Utils.EQ(this.pc.distanceTo(pt)[0], this.r)) return false;

      // point on circle

      if (pt.equalTo(this.start)) return true;
      let angle = new Flatten.Vector(this.pc, pt).slope;
      let test_arc = new Flatten.Arc(this.pc, this.r, this.startAngle, angle, this.counterClockwise);
      return Flatten.Utils.LE(test_arc.length, this.length);
    }

    /**
     * When given point belongs to arc, return array of two arcs split by this point. If points is incident
     * to start or end point of the arc, return clone of the arc. If point does not belong to the arcs, return
     * empty array.
     * @param {Point} pt Query point
     * @returns {Arc[]}
     */
    split(pt) {
      if (!this.contains(pt)) return [];
      if (Flatten.Utils.EQ_0(this.sweep)) return [this.clone()];
      if (this.start.equalTo(pt) || this.end.equalTo(pt)) return [this.clone()];
      let angle = new Flatten.Vector(this.pc, pt).slope;
      return [new Flatten.Arc(this.pc, this.r, this.startAngle, angle, this.counterClockwise), new Flatten.Arc(this.pc, this.r, angle, this.endAngle, this.counterClockwise)];
    }

    /**
     * Return middle point of the arc
     * @returns {Point}
     */
    middle() {
      let endAngle = this.counterClockwise ? this.startAngle + this.sweep / 2 : this.startAngle - this.sweep / 2;
      let arc = new Flatten.Arc(this.pc, this.r, this.startAngle, endAngle, this.counterClockwise);
      return arc.end;
    }

    /**
     * Returns chord height ("sagitta") of the arc
     * @returns {number}
     */
    chordHeight() {
      return (1.0 - Math.cos(Math.abs(this.sweep / 2.0))) * this.r;
    }

    /**
     * Returns array of intersection points between arc and other shape
     * @param {Shape} shape Shape of the one of supported types <br/>
     * @returns {Points[]}
     */
    intersect(shape) {
      if (shape instanceof Flatten.Point) {
        return this.contains(shape) ? [shape] : [];
      }
      if (shape instanceof Flatten.Line) {
        return shape.intersect(this);
      }
      if (shape instanceof Flatten.Circle) {
        return Arc.intersectArc2Circle(this, shape);
      }
      if (shape instanceof Flatten.Segment) {
        return shape.intersect(this);
      }
      if (shape instanceof Flatten.Arc) {
        return Arc.intersectArc2Arc(this, shape);
      }
      if (shape instanceof Flatten.Polygon) {
        return Flatten.Polygon.intersectShape2Polygon(this, shape);
      }
    }

    /**
     * Calculate distance and shortest segment from arc to shape and return array [distance, shortest segment]
     * @param {Shape} shape Shape of the one of supported types Point, Line, Circle, Segment, Arc, Polygon or Planar Set
     * @returns {number} distance from arc to shape
     * @returns {Segment} shortest segment between arc and shape (started at arc, ended at shape)
       */
    distanceTo(shape) {
      let {
        Distance: Distance
      } = Flatten;
      if (shape instanceof Flatten.Point) {
        let [dist, shortest_segment] = Distance.point2arc(shape, this);
        shortest_segment = shortest_segment.reverse();
        return [dist, shortest_segment];
      }
      if (shape instanceof Flatten.Circle) {
        let [dist, shortest_segment] = Distance.arc2circle(this, shape);
        return [dist, shortest_segment];
      }
      if (shape instanceof Flatten.Line) {
        let [dist, shortest_segment] = Distance.arc2line(this, shape);
        return [dist, shortest_segment];
      }
      if (shape instanceof Flatten.Segment) {
        let [dist, shortest_segment] = Distance.segment2arc(shape, this);
        shortest_segment = shortest_segment.reverse();
        return [dist, shortest_segment];
      }
      if (shape instanceof Flatten.Arc) {
        let [dist, shortest_segment] = Distance.arc2arc(this, shape);
        return [dist, shortest_segment];
      }
      if (shape instanceof Flatten.Polygon) {
        let [dist, shortest_segment] = Distance.shape2polygon(this, shape);
        return [dist, shortest_segment];
      }
      if (shape instanceof Flatten.PlanarSet) {
        let [dist, shortest_segment] = Distance.shape2planarSet(this, shape);
        return [dist, shortest_segment];
      }
    }

    /**
     * Breaks arc in extreme point 0, pi/2, pi, 3*pi/2 and returns array of sub-arcs
     * @returns {Arcs[]}
     */
    breakToFunctional() {
      let func_arcs_array = [];
      let angles = [0, Math.PI / 2, 2 * Math.PI / 2, 3 * Math.PI / 2];
      let pts = [this.pc.translate(this.r, 0), this.pc.translate(0, this.r), this.pc.translate(-this.r, 0), this.pc.translate(0, -this.r)];

      // If arc contains extreme point,
      // create test arc started at start point and ended at this extreme point
      let test_arcs = [];
      for (let i = 0; i < 4; i++) {
        if (pts[i].on(this)) {
          test_arcs.push(new Flatten.Arc(this.pc, this.r, this.startAngle, angles[i], this.counterClockwise));
        }
      }
      if (test_arcs.length == 0) {
        // arc does contain any extreme point
        func_arcs_array.push(this.clone());
      } else {
        // arc passes extreme point
        // sort these arcs by length
        test_arcs.sort((arc1, arc2) => arc1.length - arc2.length);
        for (let i = 0; i < test_arcs.length; i++) {
          let prev_arc = func_arcs_array.length > 0 ? func_arcs_array[func_arcs_array.length - 1] : undefined;
          let new_arc;
          if (prev_arc) {
            new_arc = new Flatten.Arc(this.pc, this.r, prev_arc.endAngle, test_arcs[i].endAngle, this.counterClockwise);
          } else {
            new_arc = new Flatten.Arc(this.pc, this.r, this.startAngle, test_arcs[i].endAngle, this.counterClockwise);
          }
          if (!Flatten.Utils.EQ_0(new_arc.length)) {
            func_arcs_array.push(new_arc.clone());
          }
        }

        // add last sub arc
        let prev_arc = func_arcs_array.length > 0 ? func_arcs_array[func_arcs_array.length - 1] : undefined;
        let new_arc;
        if (prev_arc) {
          new_arc = new Flatten.Arc(this.pc, this.r, prev_arc.endAngle, this.endAngle, this.counterClockwise);
        } else {
          new_arc = new Flatten.Arc(this.pc, this.r, this.startAngle, this.endAngle, this.counterClockwise);
        }
        if (!Flatten.Utils.EQ_0(new_arc.length)) {
          func_arcs_array.push(new_arc.clone());
        }
      }
      return func_arcs_array;
    }

    /**
     * Return tangent unit vector in the start point in the direction from start to end
     * @returns {Vector}
     */
    tangentInStart() {
      let vec = new Flatten.Vector(this.pc, this.start);
      let angle = this.counterClockwise ? Math.PI / 2. : -Math.PI / 2.;
      let tangent = vec.rotate(angle).normalize();
      return tangent;
    }

    /**
     * Return tangent unit vector in the end point in the direction from end to start
     * @returns {Vector}
     */
    tangentInEnd() {
      let vec = new Flatten.Vector(this.pc, this.end);
      let angle = this.counterClockwise ? -Math.PI / 2. : Math.PI / 2.;
      let tangent = vec.rotate(angle).normalize();
      return tangent;
    }

    /**
     * Returns new arc with swapped start and end angles and reversed direction
     * @returns {Arc}
     */
    reverse() {
      return new Arc(this.pc, this.r, this.endAngle, this.startAngle, !this.counterClockwise);
    }

    /**
     * Returns new arc translated by vector vec
     * @param {Vector} vec
     * @returns {Segment}
     */
    translate(...args) {
      let arc = this.clone();
      arc.pc = this.pc.translate(...args);
      return arc;
    }

    /**
     * Return new segment rotated by given angle around given point
     * If point omitted, rotate around origin (0,0)
     * Positive value of angle defines rotation counter clockwise, negative - clockwise
     * @param {number} angle - rotation angle in radians
     * @param {Point} center - center point, default is (0,0)
     * @returns {Arc}
     */
    rotate(angle = 0, center = new Flatten.Point()) {
      let m = new Flatten.Matrix();
      m = m.translate(center.x, center.y).rotate(angle).translate(-center.x, -center.y);
      return this.transform(m);
    }

    /**
     * Return new arc transformed using affine transformation matrix <br/>
     * Note, that non-equal scaling by x and y (matrix[0] != matrix[3]) produce illegal result
     * TODO: support non-equal scaling arc to ellipse or throw exception ?
     * @param {Matrix} matrix - affine transformation matrix
     * @returns {Arc}
     */
    transform(matrix = new Flatten.Matrix()) {
      let newStart = this.start.transform(matrix);
      let newEnd = this.end.transform(matrix);
      let newCenter = this.pc.transform(matrix);
      let arc = Arc.arcSE(newCenter, newStart, newEnd, this.counterClockwise);
      return arc;
    }
    static arcSE(center, start, end, counterClockwise) {
      let {
        vector: vector
      } = Flatten;
      let startAngle = vector(center, start).slope;
      let endAngle = vector(center, end).slope;
      if (Flatten.Utils.EQ(startAngle, endAngle)) {
        endAngle += 2 * Math.PI;
        counterClockwise = true;
      }
      let r = vector(center, start).length;
      return new Arc(center, r, startAngle, endAngle, counterClockwise);
    }
    static intersectArc2Arc(arc1, arc2) {
      var ip = [];
      if (arc1.box.not_intersect(arc2.box)) {
        return ip;
      }

      // Special case: overlapping arcs
      // May return up to 4 intersection points
      if (arc1.pc.equalTo(arc2.pc) && Flatten.Utils.EQ(arc1.r, arc2.r)) {
        let pt;
        pt = arc1.start;
        if (pt.on(arc2)) ip.push(pt);
        pt = arc1.end;
        if (pt.on(arc2)) ip.push(pt);
        pt = arc2.start;
        if (pt.on(arc1)) ip.push(pt);
        pt = arc2.end;
        if (pt.on(arc1)) ip.push(pt);
        return ip;
      }

      // Common case
      let circle1 = new Flatten.Circle(arc1.pc, arc1.r);
      let circle2 = new Flatten.Circle(arc2.pc, arc2.r);
      let ip_tmp = circle1.intersect(circle2);
      for (let pt of ip_tmp) {
        if (pt.on(arc1) && pt.on(arc2)) {
          ip.push(pt);
        }
      }
      return ip;
    }
    static intersectArc2Circle(arc, circle) {
      let ip = [];
      if (arc.box.not_intersect(circle.box)) {
        return ip;
      }

      // Case when arc center incident to circle center
      // Return arc's end points as 2 intersection points
      if (circle.pc.equalTo(arc.pc) && Flatten.Utils.EQ(circle.r, arc.r)) {
        ip.push(arc.start);
        ip.push(arc.end);
        return ip;
      }

      // Common case
      let circle1 = circle;
      let circle2 = new Flatten.Circle(arc.pc, arc.r);
      let ip_tmp = circle1.intersect(circle2);
      for (let pt of ip_tmp) {
        if (pt.on(arc)) {
          ip.push(pt);
        }
      }
      return ip;
    }
    definiteIntegral(ymin = 0) {
      let f_arcs = this.breakToFunctional();
      let area = f_arcs.reduce((acc, arc) => acc + arc.circularSegmentDefiniteIntegral(ymin), 0.0);
      return area;
    }
    circularSegmentDefiniteIntegral(ymin) {
      let line = new Flatten.Line(this.start, this.end);
      let onLeftSide = this.pc.leftTo(line);
      let segment = new Flatten.Segment(this.start, this.end);
      let areaTrapez = segment.definiteIntegral(ymin);
      let areaCircularSegment = this.circularSegmentArea();
      let area = onLeftSide ? areaTrapez - areaCircularSegment : areaTrapez + areaCircularSegment;
      return area;
    }
    circularSegmentArea() {
      return 0.5 * this.r * this.r * (this.sweep - Math.sin(this.sweep));
    }

    /**
     * Return string to draw arc in svg
     * @param {Object} attrs - an object with attributes of svg path element,
     * like "stroke", "strokeWidth", "fill" <br/>
     * Defaults are stroke:"black", strokeWidth:"1", fill:"none"
     * @returns {string}
     */
    svg(attrs = {}) {
      let largeArcFlag = this.sweep <= Math.PI ? "0" : "1";
      let sweepFlag = this.counterClockwise ? "1" : "0";
      let {
        stroke: stroke,
        strokeWidth: strokeWidth,
        fill: fill,
        id: id,
        className: className
      } = attrs;
      // let rest_str = Object.keys(rest).reduce( (acc, key) => acc += ` ${key}="${rest[key]}"`, "");
      let id_str = id && id.length > 0 ? "id=\"".concat(id, "\"") : "";
      let class_str = className && className.length > 0 ? "class=\"".concat(className, "\"") : "";
      if (Flatten.Utils.EQ(this.sweep, 2 * Math.PI)) {
        let circle = new Flatten.Circle(this.pc, this.r);
        return circle.svg(attrs);
      } else {
        return "\n<path d=\"M".concat(this.start.x, ",").concat(this.start.y, "\n                             A").concat(this.r, ",").concat(this.r, " 0 ").concat(largeArcFlag, ",").concat(sweepFlag, " ").concat(this.end.x, ",").concat(this.end.y, "\"\n                    stroke=\"").concat(stroke || "black", "\" stroke-width=\"").concat(strokeWidth || 1, "\" fill=\"").concat(fill || "none", "\" ").concat(id_str, " ").concat(class_str, " />");
      }
    }

    /**
     * This method returns an object that defines how data will be
     * serialized when called JSON.stringify() method
     * @returns {Object}
     */
    toJSON() {
      return Object.assign({}, this, {
        name: "arc"
      });
    }
  };

  /**
   * Function to create arc equivalent to "new" constructor
   * @param args
   */
  Flatten.arc = (...args) => new Flatten.Arc(...args);
};
},{}],"node_modules/flatten-js/classes/box.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 3/7/2017.
 */
"use strict";

module.exports = function (Flatten) {
  /**
   * Class Box represent bounding box of the shape
   * @type {Box}
   */
  Flatten.Box = class Box {
    /**
     *
     * @param {number} xmin - minimal x coordinate
     * @param {number} ymin - minimal y coordinate
     * @param {number} xmax - maximal x coordinate
     * @param {number} ymax - maximal y coordinate
     */
    constructor(xmin = undefined, ymin = undefined, xmax = undefined, ymax = undefined) {
      /**
       * Minimal x coordinate
       * @type {number}
       */
      this.xmin = xmin;
      /**
       * Minimal y coordinate
       * @type {number}
       */
      this.ymin = ymin;
      /**
       * Maximal x coordinate
       * @type {number}
       */
      this.xmax = xmax;
      /**
       * Maximal y coordinate
       * @type {number}
       */
      this.ymax = ymax;
    }

    /**
     * Clones and returns new instance of box
     * @returns {Box}
     */
    clone() {
      return new Box(this.xmin, this.ymin, this.xmax, this.ymax);
    }

    /**
     * Property low need for interval tree interface
     * @returns {Point}
     */
    get low() {
      return new Flatten.Point(this.xmin, this.ymin);
    }

    /**
     * Property high need for interval tree interface
     * @returns {Point}
     */
    get high() {
      return new Flatten.Point(this.xmax, this.ymax);
    }

    /**
     * Property max returns the box itself !
     * @returns {Box}
     */
    get max() {
      return this.clone();
    }

    /**
     * Return center of the box
     * @returns {Point}
     */
    get center() {
      return new Flatten.Point((this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2);
    }

    /**
     * Returns true if not intersected with other box
     * @param {Box} other_box - other box to test
     * @returns {boolean}
     */
    not_intersect(other_box) {
      return this.xmax < other_box.xmin || this.xmin > other_box.xmax || this.ymax < other_box.ymin || this.ymin > other_box.ymax;
    }

    /**
     * Returns true if intersected with other box
     * @param {Box} other_box - Query box
     * @returns {boolean}
     */
    intersect(other_box) {
      return !this.not_intersect(other_box);
    }

    /**
     * Returns new box merged with other box
     * @param {Box} other_box - Other box to merge with
     * @returns {Box}
     */
    merge(other_box) {
      return new Box(this.xmin === undefined ? other_box.xmin : Math.min(this.xmin, other_box.xmin), this.ymin === undefined ? other_box.ymin : Math.min(this.ymin, other_box.ymin), this.xmax === undefined ? other_box.xmax : Math.max(this.xmax, other_box.xmax), this.ymax === undefined ? other_box.ymax : Math.max(this.ymax, other_box.ymax));
    }

    /**
     * Defines predicate "less than" between two boxes. Need for interval index
     * @param {Box} other_box - other box
     * @returns {boolean} - true if this box less than other box, false otherwise
     */
    less_than(other_box) {
      if (this.low.lessThan(other_box.low)) return true;
      if (this.low.equalTo(other_box.low) && this.high.lessThan(other_box.high)) return true;
      return false;
    }

    /**
     * Returns true if this box is equal to other box, false otherwise
     * @param {Box} other_box - query box
     * @returns {boolean}
     */
    equal_to(other_box) {
      return this.low.equalTo(other_box.low) && this.high.equalTo(other_box.high);
    }
    output() {
      return this.clone();
    }
    maximal_val(box1, box2) {
      // return pt1.lessThan(pt2) ? pt2.clone() : pt1.clone();
      return box1.merge(box2);
    }
    val_less_than(pt1, pt2) {
      return pt1.lessThan(pt2);
    }

    /**
     * Set new values to the box object
     * @param {number} xmin - miminal x coordinate
     * @param {number} ymin - minimal y coordinate
     * @param {number} xmax - maximal x coordinate
     * @param {number} ymax - maximal y coordinate
     */
    set(xmin, ymin, xmax, ymax) {
      this.xmin = xmin;
      this.ymin = ymin;
      this.xmax = xmax;
      this.ymax = ymax;
    }

    /**
     * Return string to draw circle in svg
     * @param {Object} attrs - an object with attributes of svg rectangle element,
     * like "stroke", "strokeWidth", "fill" <br/>
     * Defaults are stroke:"black", strokeWidth:"1", fill:"none"
     * @returns {string}
     */
    svg(attrs = {}) {
      let {
        stroke: stroke,
        strokeWidth: strokeWidth,
        fill: fill,
        id: id,
        className: className
      } = attrs;
      // let rest_str = Object.keys(rest).reduce( (acc, key) => acc += ` ${key}="${rest[key]}"`, "");
      let id_str = id && id.length > 0 ? "id=\"".concat(id, "\"") : "";
      let class_str = className && className.length > 0 ? "class=\"".concat(className, "\"") : "";
      let width = this.xmax - this.xmin;
      let height = this.ymax - this.ymin;
      return "\n<rect x=\"".concat(this.xmin, "\" y=\"").concat(this.ymin, "\" width=").concat(width, " height=").concat(height, " stroke=\"").concat(stroke || "black", "\" stroke-width=\"").concat(strokeWidth || 1, "\" fill=\"").concat(fill || "none", "\" ").concat(id_str, " ").concat(class_str, " />");
    }
  };

  /**
   * Shortcut to create new circle
   * @param args
   * @returns {Box}
   */
  Flatten.box = (...args) => new Flatten.Box(...args);
};
},{}],"node_modules/flatten-js/classes/edge.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 3/17/2017.
 */

module.exports = function (Flatten) {
  /**
   * Class representing an edge of polygon. Edge shape may be Segment or Arc.
   * Each edge contains references to the next and previous edges in the face of the polygon.
   *
   * @type {Edge}
   */
  Flatten.Edge = class Edge {
    /**
     * Construct new instance of edge
     * @param {Shape} shape Shape of type Segment of Arc
     */
    constructor(shape) {
      /**
       * Shape of the edge: Segment or Arc
       */
      this.shape = shape;
      /**
       * Pointer to the next edge in the face
       */
      this.next;
      /**
       * Pointer to the previous edge in the face
       */
      this.prev;
      /**
       * Pointer to the face containing this edge
       * @type {Face}
       */
      this.face;
      /**
       * "Arc distance" from the face start
       * @type {number}
       */
      this.arc_length = 0;
      /**
       * Start inclusion flag (inside/outside/boundary)
       * @type {Boolean}
       */
      this.bvStart = undefined;
      /**
       * End inclusion flag (inside/outside/boundary)
       * @type {Boolean}
       */
      this.bvEnd = undefined;
      /**
       * Edge inclusion flag (Flatten.INSIDE, Flatten.OUTSIDE, Flatten.BOUNDARY)
       * @type {*}
       */
      this.bv = undefined;
      /**
       * Overlap flag for boundary edge (Flatten.OVERLAP_SAME/Flatten.OVERLAP_OPPOSITE)
       * @type {*}
       */
      this.overlap = undefined;
    }

    /**
     * Get edge start point
     */
    get start() {
      return this.shape.start;
    }

    /**
     * Get edge end point
     */
    get end() {
      return this.shape.end;
    }

    /**
     * Get edge length
     */
    get length() {
      return this.shape.length;
    }

    /**
     * Get bounding box of the edge
     * @returns {Box}
     */
    get box() {
      return this.shape.box;
    }
    isSegment() {
      return this.shape instanceof Flatten.Segment;
    }
    isArc() {
      return this.shape instanceof Flatten.Arc;
    }
    /**
     * Get middle point of the edge
     * @returns {Point}
     */
    middle() {
      return this.shape.middle();
    }

    /**
     * Returns true if point belongs to the edge, false otherwise
     * @param {Point} pt - test point
     */
    contains(pt) {
      return this.shape.contains(pt);
    }

    /**
     * Set inclusion flag of the edge with respect to another polygon
     * Inclusion flag is one of Flatten.INSIDE, Flatten.OUTSIDE, Flatten.BOUNDARY
     * @param polygon
     */
    setInclusion(polygon) {
      if (this.bv !== undefined) return this.bv;
      if (this.bvStart === undefined) {
        this.bvStart = Flatten.ray_shoot(polygon, this.start);
      }
      if (this.bvEnd === undefined) {
        this.bvEnd = Flatten.ray_shoot(polygon, this.end);
      }
      /* At least one end outside - the whole edge outside */
      if (this.bvStart === Flatten.OUTSIDE || this.bvEnd == Flatten.OUTSIDE) {
        this.bv = Flatten.OUTSIDE;
      }
      /* At least one end inside - the whole edge inside */else if (this.bvStart === Flatten.INSIDE || this.bvEnd == Flatten.INSIDE) {
        this.bv = Flatten.INSIDE;
      }
      /* Both are boundary - check the middle point */else {
        let bvMiddle = Flatten.ray_shoot(polygon, this.middle());
        this.bv = bvMiddle;
      }
      return this.bv;
    }

    /**
     * Set overlapping between two coincident boundary edges
     * Overlapping flag is one of Flatten.OVERLAP_SAME or Flatten.OVERLAP_OPPOSITE
     * @param edge
     */
    setOverlap(edge) {
      let flag = undefined;
      let shape1 = this.shape;
      let shape2 = edge.shape;
      if (shape1 instanceof Flatten.Segment && shape2 instanceof Flatten.Segment) {
        if (shape1.start.equalTo(shape2.start) && shape1.end.equalTo(shape2.end)) {
          flag = Flatten.OVERLAP_SAME;
        } else if (shape1.start.equalTo(shape2.end) && shape1.end.equalTo(shape2.start)) {
          flag = Flatten.OVERLAP_OPPOSITE;
        }
      } else if (shape1 instanceof Flatten.Arc && shape2 instanceof Flatten.Arc) {
        if (shape1.start.equalTo(shape2.start) && shape1.end.equalTo(shape2.end) && /*shape1.counterClockwise === shape2.counterClockwise &&*/
        shape1.middle().equalTo(shape2.middle())) {
          flag = Flatten.OVERLAP_SAME;
        } else if (shape1.start.equalTo(shape2.end) && shape1.end.equalTo(shape2.start) && /*shape1.counterClockwise !== shape2.counterClockwise &&*/
        shape1.middle().equalTo(shape2.middle())) {
          flag = Flatten.OVERLAP_OPPOSITE;
        }
      } else if (shape1 instanceof Flatten.Segment && shape2 instanceof Flatten.Arc || shape1 instanceof Flatten.Arc && shape2 instanceof Flatten.Segment) {
        if (shape1.start.equalTo(shape2.start) && shape1.end.equalTo(shape2.end) && shape1.middle().equalTo(shape2.middle())) {
          flag = Flatten.OVERLAP_SAME;
        } else if (shape1.start.equalTo(shape2.end) && shape1.end.equalTo(shape2.start) && shape1.middle().equalTo(shape2.middle())) {
          flag = Flatten.OVERLAP_OPPOSITE;
        }
      }

      /* Do not update overlap flag if already set on previous chain */
      if (this.overlap === undefined) this.overlap = flag;
      if (edge.overlap === undefined) edge.overlap = flag;
    }
    svg() {
      if (this.shape instanceof Flatten.Segment) {
        return " L".concat(this.shape.end.x, ",").concat(this.shape.end.y);
      } else if (this.shape instanceof Flatten.Arc) {
        let arc = this.shape;
        let largeArcFlag;
        let sweepFlag = arc.counterClockwise ? "1" : "0";

        // Draw full circe arc as special case: split it into two half-circles
        if (Flatten.Utils.EQ(arc.sweep, 2 * Math.PI)) {
          let sign = arc.counterClockwise ? 1 : -1;
          let halfArc1 = new Flatten.Arc(arc.pc, arc.r, arc.startAngle, arc.startAngle + sign * Math.PI, arc.counterClockwise);
          let halfArc2 = new Flatten.Arc(arc.pc, arc.r, arc.startAngle + sign * Math.PI, arc.endAngle, arc.counterClockwise);
          largeArcFlag = "0";
          return " A".concat(halfArc1.r, ",").concat(halfArc1.r, " 0 ").concat(largeArcFlag, ",").concat(sweepFlag, " ").concat(halfArc1.end.x, ",").concat(halfArc1.end.y, "\n                    A").concat(halfArc2.r, ",").concat(halfArc2.r, " 0 ").concat(largeArcFlag, ",").concat(sweepFlag, " ").concat(halfArc2.end.x, ",").concat(halfArc2.end.y);
        } else {
          largeArcFlag = arc.sweep <= Math.PI ? "0" : "1";
          return " A".concat(arc.r, ",").concat(arc.r, " 0 ").concat(largeArcFlag, ",").concat(sweepFlag, " ").concat(arc.end.x, ",").concat(arc.end.y);
        }
      }
    }
    toJSON() {
      return this.shape.toJSON();
    }
  };
};
},{}],"node_modules/flatten-js/classes/face.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 3/17/2017.
 */

"use strict";

module.exports = function (Flatten) {
  let {
    Point: Point,
    point: point,
    Segment: Segment,
    segment: segment,
    Arc: Arc,
    Box: Box,
    Edge: Edge,
    Circle: Circle
  } = Flatten;

  /**
   * Class representing a face (closed loop) in a [polygon]{@link Flatten.Polygon} object.
   * Face is a circular bidirectional linked list of [edges]{@link Flatten.Edge}.
   * Face object cannot be instantiated with a constructor.
   * Instead, use [polygon.addFace()]{@link Flatten.Polygon#addFace} method.
   * <br/>
   * Note, that face only set entry point to the linked list of edges but does not contain edges by itself.
   * Container of edges is a property of the polygon object. <br/>
   *
   * @example
   * // Face implements "next" iterator which enables to iterate edges in for loop:
   * for (let edge of face) {
   *      console.log(edge.shape.length)     // do something
   * }
   *
   * // Instead, it is possible to iterate edges as linked list, starting from face.first:
   * let edge = face.first;
   * do {
   *   console.log(edge.shape.length);   // do something
   *   edge = edge.next;
   * } while (edge != face.first)
   */
  Flatten.Face = class Face {
    constructor(polygon, ...args) {
      /**
       * Reference to the first edge in face
       */
      this.first;
      /**
       * Reference to the last edge in face
       */
      this.last;
      this._box = undefined; // new Box();
      this._orientation = undefined;
      if (args.length == 0) {
        return;
      }

      /* If passed an array it supposed to be:
       1) array of shapes that performs close loop or
       2) array of points that performs set of vertices
       */
      if (args.length == 1) {
        if (args[0] instanceof Array) {
          // let argsArray = args[0];
          let shapes = args[0]; // argsArray[0];
          if (shapes.length == 0) return;
          if (shapes.every(shape => {
            return shape instanceof Point;
          })) {
            let segments = Face.points2segments(shapes);
            this.shapes2face(polygon.edges, segments);
          } else if (shapes.every(shape => {
            return shape instanceof Segment || shape instanceof Arc;
          })) {
            this.shapes2face(polygon.edges, shapes);
          }
          // this is from JSON.parse object
          else if (shapes.every(shape => {
            return shape.name === "segment" || shape.name === "arc";
          })) {
            let flattenShapes = [];
            for (let shape of shapes) {
              let flattenShape;
              if (shape.name === "segment") {
                flattenShape = new Segment(shape);
              } else {
                flattenShape = new Arc(shape);
              }
              flattenShapes.push(flattenShape);
            }
            this.shapes2face(polygon.edges, flattenShapes);
          }
        }
        /* Create new face and copy edges into polygon.edges set */else if (args[0] instanceof Face) {
          let face = args[0];
          this.first = face.first;
          this.last = face.last;
          for (let edge of face) {
            polygon.edges.add(edge);
          }
        }
        /* Instantiate face from circle circle in CCW orientation */else if (args[0] instanceof Circle) {
          this.shapes2face(polygon.edges, [args[0].toArc(Flatten.CCW)]);
        }
        /* Instantiate face from a box in CCW orientation */else if (args[0] instanceof Box) {
          let box = args[0];
          this.shapes2face(polygon.edges, [segment(point(box.xmin, box.ymin), point(box.xmax, box.ymin)), segment(point(box.xmax, box.ymin), point(box.xmax, box.ymax)), segment(point(box.xmax, box.ymax), point(box.xmin, box.ymax)), segment(point(box.xmin, box.ymax), point(box.xmin, box.ymin))]);
        }
      }
      /* If passed two edges, consider them as start and end of the face loop */
      /* THIS METHOD WILL BE USED BY BOOLEAN OPERATIONS */
      /* Assume that edges already copied to polygon.edges set in the clip algorithm !!! */
      if (args.length == 2 && args[0] instanceof Edge && args[1] instanceof Edge) {
        this.first = args[0]; // first edge in face or undefined
        this.last = args[1]; // last edge in face or undefined
        this.last.next = this.first;
        this.first.prev = this.last;

        // set arc length
        this.setArcLength();
        /*
         let edge = this.first;
         edge.arc_length = 0;
         edge = edge.next;
         while (edge !== this.first) {
         edge.arc_length = edge.prev.arc_length + edge.prev.length;
         edge = edge.next;
         }
         */

        // this.box = this.getBox();
        // this.orientation = this.getOrientation();      // face direction cw or ccw
      }
    }
    [Symbol.iterator]() {
      let edge = undefined;
      return {
        next: () => {
          let value = edge ? edge : this.first;
          let done = this.first ? edge ? edge === this.first : false : true;
          edge = value ? value.next : undefined;
          return {
            value: value,
            done: done
          };
        }
      };
    }
    /**
     * Return array of edges from first to last
     * @returns {Array}
     */
    get edges() {
      let face_edges = [];
      for (let edge of this) {
        face_edges.push(edge);
      }
      return face_edges;
    }

    /**
     * Return number of edges in the face
     * @returns {number}
     */
    get size() {
      let counter = 0;
      for (let edge of this) {
        counter++;
      }
      return counter;
    }

    /**
     * Return bounding box of the face
     * @returns {Box}
     */
    get box() {
      if (this._box === undefined) {
        let box = new Flatten.Box();
        for (let edge of this) {
          box = box.merge(edge.box);
        }
        this._box = box;
      }
      return this._box;
    }
    static points2segments(points) {
      let segments = [];
      for (let i = 0; i < points.length; i++) {
        segments.push(new Segment(points[i], points[(i + 1) % points.length]));
      }
      return segments;
    }
    shapes2face(edges, shapes) {
      for (let shape of shapes) {
        let edge = new Edge(shape);
        this.append(edges, edge);
        // this.box = this.box.merge(shape.box);
        // edges.add(edge);
      }
      // this.orientation = this.getOrientation();              // face direction cw or ccw
    }

    /**
     * Returns true if face is empty, false otherwise
     * @returns {boolean}
     */
    isEmpty() {
      return this.first === undefined && this.last === undefined;
    }

    /**
     * Append given edge after the last edge (and before the first edge). <br/>
     * This method mutates current object and does not return any value
     * @param {PlanarSet} edges - Container of edges
     * @param {Edge} edge - Edge to be appended to the linked list
     */
    append(edges, edge) {
      if (this.first === undefined) {
        edge.prev = edge;
        edge.next = edge;
        this.first = edge;
        this.last = edge;
        edge.arc_length = 0;
      } else {
        // append to end
        edge.prev = this.last;
        this.last.next = edge;

        // update edge to be last
        this.last = edge;

        // restore circular links
        this.last.next = this.first;
        this.first.prev = this.last;

        // set arc length
        edge.arc_length = edge.prev.arc_length + edge.prev.length;
      }
      edge.face = this;
      edges.add(edge); // Add new edges into edges container
    }

    /**
     * Insert edge newEdge into the linked list after the edge edgeBefore <br/>
     * This method mutates current object and does not return any value
     * @param {PlanarSet} edges - Container of edges
     * @param {Edge} newEdge - Edge to be inserted into linked list
     * @param {Edge} edgeBefore - Edge to insert newEdge after it
     */
    insert(edges, newEdge, edgeBefore) {
      if (this.first === undefined) {
        newEdge.prev = newEdge;
        newEdge.next = newEdge;
        this.first = newEdge;
        this.last = newEdge;
      } else {
        /* set links to new edge */
        let edgeAfter = edgeBefore.next;
        edgeBefore.next = newEdge;
        edgeAfter.prev = newEdge;

        /* set links from new edge */
        newEdge.prev = edgeBefore;
        newEdge.next = edgeAfter;

        /* extend chain if new edge added after last edge */
        if (this.last === edgeBefore) this.first = newEdge;
      }
      newEdge.face = this;

      // set arc length
      if (newEdge.prev === this.last) {
        newEdge.arc_length = 0;
      } else {
        newEdge.arc_length = newEdge.prev.arc_length + newEdge.prev.length;
      }
      edges.add(newEdge); // Add new edges into edges container
    }

    /**
     * Remove the given edge from the linked list of the face <br/>
     * This method mutates current object and does not return any value
     * @param {PlanarSet} edges - Container of edges
     * @param {Edge} edge - Edge to be removed
     */
    remove(edges, edge) {
      // special case if last edge removed
      if (edge === this.first && edge === this.last) {
        this.first = undefined;
        this.last = undefined;
      } else {
        // update linked list
        edge.prev.next = edge.next;
        edge.next.prev = edge.prev;
        // update first if need
        if (edge === this.first) {
          this.first = edge.next;
        }
        // update last if need
        if (edge === this.last) {
          this.last = edge.prev;
        }
      }
      edges.delete(edge); // delete from PlanarSet of edges and update index
    }

    /**
     * Reverse orientation of the face: first edge become last and vice a verse,
     * all edges starts and ends swapped, direction of arcs inverted.
     */
    reverse() {
      // collect edges in revert order with reverted shapes
      let edges = [];
      let edge_tmp = this.last;
      do {
        // reverse shape
        edge_tmp.shape = edge_tmp.shape.reverse();
        edges.push(edge_tmp);
        edge_tmp = edge_tmp.prev;
      } while (edge_tmp !== this.last);

      // restore linked list
      this.first = undefined;
      this.last = undefined;
      for (let edge of edges) {
        if (this.first === undefined) {
          edge.prev = edge;
          edge.next = edge;
          this.first = edge;
          this.last = edge;
          edge.arc_length = 0;
        } else {
          // append to end
          edge.prev = this.last;
          this.last.next = edge;

          // update edge to be last
          this.last = edge;

          // restore circular links
          this.last.next = this.first;
          this.first.prev = this.last;

          // set arc length
          edge.arc_length = edge.prev.arc_length + edge.prev.length;
        }
      }

      // Recalculate orientation, if set
      if (this._orientation !== undefined) {
        this._orientation = undefined;
        this._orientation = this.orientation();
      }
    }

    /**
     * Set arc_length property for each of the edges in the face.
     * Arc_length of the edge it the arc length from the first edge of the face
     */
    setArcLength() {
      for (let edge of this) {
        if (edge === this.first) {
          edge.arc_length = 0.0;
        } else {
          edge.arc_length = edge.prev.arc_length + edge.prev.length;
        }
        edge.face = this;
      }
    }

    /**
     * Returns the absolute value of the area of the face
     * @returns {number}
     */
    area() {
      return Math.abs(this.signedArea());
    }

    /**
     * Returns signed area of the simple face.
     * Face is simple if it has no self intersections that change its orientation.
     * Then the area will be positive if the orientation of the face is clockwise,
     * and negative if orientation is counterclockwise.
     * It may be zero if polygon is degenerated.
     * @returns {number}
     */
    signedArea() {
      let sArea = 0;
      let ymin = this.box.ymin;
      for (let edge of this) {
        sArea += edge.shape.definiteIntegral(ymin);
      }
      return sArea;
    }

    /**
     * Return face orientation: one of Flatten.ORIENTATION.CCW, Flatten.ORIENTATION.CW, Flatten.ORIENTATION.NOT_ORIENTABLE <br/>
     * According to Green theorem the area of a closed curve may be calculated as double integral,
     * and the sign of the integral will be defined by the direction of the curve.
     * When the integral ("signed area") will be negative, direction is counter clockwise,
     * when positive - clockwise and when it is zero, polygon is not orientable.
     * See {@link https://mathinsight.org/greens_theorem_find_area}
     * @returns {number}
     */
    orientation() {
      if (this._orientation === undefined) {
        let area = this.signedArea();
        if (Flatten.Utils.EQ_0(area)) {
          this._orientation = Flatten.ORIENTATION.NOT_ORIENTABLE;
        } else if (Flatten.Utils.LT(area, 0)) {
          this._orientation = Flatten.ORIENTATION.CCW;
        } else {
          this._orientation = Flatten.ORIENTATION.CW;
        }
      }
      return this._orientation;
    }

    /**
     * Returns true if face of the polygon is simple (no self-intersection points found)
     * NOTE: this method is incomplete because it doe not exclude touching points
     * Real self intersection inverts orientation of the polygon.
     * But this is also good enough for the demonstration of the idea
     * @param {Edges} edges - reference to polygon.edges to provide search index
     * @returns {boolean}
     */
    isSimple(edges) {
      let ip = Face.getSelfIntersections(this, edges, true);
      return ip.length == 0;
    }
    static getSelfIntersections(face, edges, exitOnFirst = false) {
      let int_points = [];

      // calculate intersections
      for (let edge1 of face) {
        // request edges of polygon in the box of edge1
        let resp = edges.search(edge1.box);

        // for each edge2 in response
        for (let edge2 of resp) {
          // Skip itself
          if (edge1 === edge2) continue;

          // Skip next and previous edge if both are segment (if one of them arc - calc intersection)
          if (edge1.shape instanceof Flatten.Segment && edge2.shape instanceof Flatten.Segment && (edge1.next === edge2 || edge1.prev === edge2)) continue;

          // calculate intersections between edge1 and edge2
          let ip = edge1.shape.intersect(edge2.shape);

          // for each intersection point
          for (let pt of ip) {
            // skip start-end connections
            if (pt.equalTo(edge1.start) && pt.equalTo(edge2.end) && edge2 === edge1.prev) continue;
            if (pt.equalTo(edge1.end) && pt.equalTo(edge2.start) && edge2 === edge1.next) continue;
            int_points.push(pt);
            if (exitOnFirst) break;
          }
          if (int_points.length > 0 && exitOnFirst) break;
        }
        if (int_points.length > 0 && exitOnFirst) break;
      }
      return int_points;
    }
    toJSON() {
      return this.edges.map(edge => edge.toJSON());
    }

    /**
     * Returns string to be assigned to "d" attribute inside defined "path"
     * @returns {string}
     */
    svg() {
      let svgStr = "\nM".concat(this.first.start.x, ",").concat(this.first.start.y);
      for (let edge of this) {
        svgStr += edge.svg();
      }
      svgStr += " z";
      return svgStr;
    }
  };
};
},{}],"node_modules/flatten-js/classes/ray.js":[function(require,module,exports) {
"use strict";

module.exports = function (Flatten) {
  let {
    Point: Point,
    Segment: Segment,
    Line: Line,
    Circle: Circle,
    Arc: Arc,
    Box: Box,
    Vector: Vector
  } = Flatten;
  /**
   * Class representing a horizontal ray, used by ray shooting algorithm
   * @type {Ray}
   */
  Flatten.Ray = class Ray {
    /**
     * Construct ray by setting start point
     * @param {Point} pt - start point
     */
    constructor(...args) {
      this.pt = new Point();
      if (args.length == 0) {
        return;
      }
      if (args.length == 1 && args[0] instanceof Point) {
        this.pt = args[0].clone();
        return;
      }
      if (args.length == 2 && typeof args[0] == "number" && typeof args[1] == "number") {
        this.pt = new Point(args[0], args[1]);
        return;
      }
      throw Flatten.Errors.ILLEGAL_PARAMETERS;
    }

    /**
     * Returns copied instance of the ray object
     * @returns {Ray}
     */
    clone() {
      return new Ray(this.pt);
    }

    /**
     * Returns half-infinite bounding box of the ray
     * @returns {Box} - bounding box
     */
    get box() {
      return new Box(this.pt.x, this.pt.y, Number.POSITIVE_INFINITY, this.pt.y);
    }

    /**
     * Return ray start point
     * @returns {Point} - ray start point
     */
    get start() {
      return this.pt;
    }

    /**
     * Return ray normal vector (0,1) - horizontal ray
     * @returns {Vector} - ray normal vector
     */
    get norm() {
      return new Vector(0, 1);
    }

    /**
     * Returns array of intersection points between ray and segment or arc
     * @param {Segment|Arc} - Shape to intersect with ray
     * @returns {Array} array of intersection points
     */
    intersect(shape) {
      if (shape instanceof Segment) {
        return this.intersectRay2Segment(this, shape);
      }
      if (shape instanceof Arc) {
        return this.intersectRay2Arc(this, shape);
      }
    }
    intersectRay2Segment(ray, segment) {
      let ip = [];
      if (ray.box.not_intersect(segment.box)) {
        return ip;
      }
      let line = new Line(ray.start, ray.norm);
      let ip_tmp = line.intersect(segment);
      for (let pt of ip_tmp) {
        if (Flatten.Utils.GE(pt.x, ray.start.x)) {
          ip.push(pt);
        }
      }

      /* If there were two intersection points between line and ray,
      and now there is exactly one left, it means ray starts between these points
      and there is another intersection point - start of the ray */
      if (ip_tmp.length == 2 && ip.length == 1 && ray.start.on(line)) {
        ip.push(ray.start);
      }
      return ip;
    }
    intersectRay2Arc(ray, arc) {
      let ip = [];
      if (ray.box.not_intersect(arc.box)) {
        return ip;
      }
      let line = new Line(ray.start, ray.norm);
      let ip_tmp = line.intersect(arc);
      for (let pt of ip_tmp) {
        if (Flatten.Utils.GE(pt.x, ray.start.x)) {
          ip.push(pt);
        }
      }
      return ip;
    }
  };
  Flatten.ray = (...args) => new Flatten.Ray(...args);
};
},{}],"node_modules/flatten-js/algorithms/ray_shooting.js":[function(require,module,exports) {
"use strict";

module.exports = function (Flatten) {
  let {
    Polygon: Polygon,
    Point: Point,
    Segment: Segment,
    Arc: Arc,
    Line: Line,
    Ray: Ray
  } = Flatten;
  Flatten.ray_shoot = function (polygon, point) {
    let contains = undefined;

    // if (!(polygon instanceof Polygon && point instanceof Point)) {
    //     throw Flatten.Errors.ILLEGAL_PARAMETERS;
    // }

    // 1. Quick reject
    if (polygon.box.not_intersect(point.box)) {
      return Flatten.OUTSIDE;
    }
    let ray = new Ray(point);
    let line = new Line(ray.pt, ray.norm);

    // 2. Locate relevant edges of the polygon
    let resp_edges = polygon.edges.search(ray.box);
    if (resp_edges.length == 0) {
      return Flatten.OUTSIDE;
    }

    // 3. Calculate intersections
    let intersections = [];
    for (let edge of resp_edges) {
      for (let ip of ray.intersect(edge.shape)) {
        // If intersection is equal to query point then point lays on boundary
        if (ip.equalTo(point)) {
          return Flatten.BOUNDARY;
        }
        intersections.push({
          pt: ip,
          edge: edge
        });
      }
    }

    // 4. Sort intersection in x-ascending order
    intersections.sort((i1, i2) => {
      if (Flatten.Utils.LT(i1.pt.x, i2.pt.x)) {
        return -1;
      }
      if (Flatten.Utils.GT(i1.pt.x, i2.pt.x)) {
        return 1;
      }
      return 0;
    });

    // 5. Count real intersections, exclude touching
    let counter = 0;
    for (let i = 0; i < intersections.length; i++) {
      let intersection = intersections[i];
      if (intersection.pt.equalTo(intersection.edge.shape.start)) {
        /* skip same point between same edges if already counted */
        if (i > 0 && intersection.pt.equalTo(intersections[i - 1].pt) && intersection.edge.prev === intersections[i - 1].edge) {
          continue;
        }
        let prev_edge = intersection.edge.prev;
        while (Flatten.Utils.EQ_0(prev_edge.length)) {
          prev_edge = prev_edge.prev;
        }
        let prev_tangent = prev_edge.shape.tangentInEnd();
        let prev_point = intersection.pt.translate(prev_tangent);
        let cur_tangent = intersection.edge.shape.tangentInStart();
        let cur_point = intersection.pt.translate(cur_tangent);
        let prev_on_the_left = prev_point.leftTo(line);
        let cur_on_the_left = cur_point.leftTo(line);
        if (prev_on_the_left && !cur_on_the_left || !prev_on_the_left && cur_on_the_left) {
          counter++;
        }
      } else if (intersection.pt.equalTo(intersection.edge.shape.end)) {
        /* skip same point between same edges if already counted */
        if (i > 0 && intersection.pt.equalTo(intersections[i - 1].pt) && intersection.edge.next === intersections[i - 1].edge) {
          continue;
        }
        let next_edge = intersection.edge.next;
        while (Flatten.Utils.EQ_0(next_edge.length)) {
          next_edge = next_edge.next;
        }
        let next_tangent = next_edge.shape.tangentInStart();
        let next_point = intersection.pt.translate(next_tangent);
        let cur_tangent = intersection.edge.shape.tangentInEnd();
        let cur_point = intersection.pt.translate(cur_tangent);
        let next_on_the_left = next_point.leftTo(line);
        let cur_on_the_left = cur_point.leftTo(line);
        if (next_on_the_left && !cur_on_the_left || !next_on_the_left && cur_on_the_left) {
          counter++;
        }
      } else {
        /* intersection point is not a coincident with a vertex */
        if (intersection.edge.shape instanceof Segment) {
          counter++;
        } else {
          /* Check if ray does not touch the curve in the extremal (top or bottom) point */
          let box = intersection.edge.shape.box;
          if (!(Flatten.Utils.EQ(intersection.pt.y, box.ymin) || Flatten.Utils.EQ(intersection.pt.y, box.ymax))) {
            counter++;
          }
        }
      }
    }

    // 6. Odd or even?
    contains = counter % 2 == 1 ? Flatten.INSIDE : Flatten.OUTSIDE;
    return contains;
  };
};
},{}],"node_modules/flatten-js/classes/polygon.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 3/15/2017.
 */

"use strict";

module.exports = function (Flatten) {
  let {
    Edge: Edge,
    Face: Face,
    PlanarSet: PlanarSet,
    Box: Box
  } = Flatten;
  let {
    ray_shoot: ray_shoot
  } = Flatten;
  /**
   * Class representing a polygon.<br/>
   * Polygon in FlattenJS is a multipolygon comprised from a set of [faces]{@link Flatten.Face}. <br/>
   * Face, in turn, is a closed loop of [edges]{@link Flatten.Edge}, where edge may be segment or circular arc<br/>
   * @type {Polygon}
   */
  Flatten.Polygon = class Polygon {
    /**
     * Constructor creates new instance of polygon.<br/>
     * New polygon is empty. Add face to the polygon using method <br/>
     * <code>
     *     polygon.addFace(Points[]|Segments[]|Arcs[])
     * </code>
     */
    constructor() {
      /**
       * Container of faces (closed loops), may be empty
       * @type {PlanarSet}
       */
      this.faces = new PlanarSet();
      /**
       * Container of edges
       * @type {PlanarSet}
       */
      this.edges = new PlanarSet();
    }

    /**
     * (Getter) Returns bounding box of the polygon
     * @returns {Box}
     */
    get box() {
      return [...this.faces].reduce((acc, face) => acc.merge(face.box), new Box());
    }

    /**
     * (Getter) Returns array of vertices
     * @returns {Array}
     */
    get vertices() {
      return [...this.edges].map(edge => edge.start);
    }

    /**
     * Return true is polygon has no edges
     * @returns {boolean}
     */
    isEmpty() {
      return this.edges.size === 0;
    }

    /**
     * Add new face to polygon. Returns added face
     * @param {Points[]|Segments[]|Arcs[]|Circle|Box} args -  new face may be create with one of the following ways: <br/>
     * 1) array of points that describe closed path (edges are segments) <br/>
     * 2) array of shapes (segments and arcs) which describe closed path <br/>
     * 3) circle - will be added as counterclockwise arc <br/>
     * 4) box - will be added as counterclockwise rectangle <br/>
     * You can chain method face.reverse() is you need to change direction of the creates face
     * @returns {Face}
     */
    addFace(...args) {
      let face = new Face(this, ...args);
      this.faces.add(face);
      return face;
    }

    /**
     * Delete existing face from polygon
     * @param {Face} face Face to be deleted
     * @returns {boolean}
     */
    deleteFace(face) {
      for (let edge of face) {
        let deleted = this.edges.delete(edge);
      }
      let deleted = this.faces.delete(face);
      return deleted;
    }

    /**
     * Delete chain of edges from the face.
     * @param {Face} face Face to remove chain
     * @param {Edge} edgeFrom Start of the chain of edges to be removed
     * @param {Edge} edgeTo End of the chain of edges to be removed
     */
    removeChain(face, edgeFrom, edgeTo) {
      // Special case: all edges removed
      if (edgeTo.next === edgeFrom) {
        this.deleteFace(face);
        return;
      }
      for (let edge = edgeFrom; edge !== edgeTo.next; edge = edge.next) {
        face.remove(this.edges, edge);
        // this.edges.delete(edge);      // delete from PlanarSet of edges and update index
        if (face.isEmpty()) {
          this.deleteFace(face); // delete from PlanarSet of faces and update index
          break;
        }
      }
    }

    /**
     * Add point as a new vertex and split edge. Point supposed to belong to an edge.
     * When edge is split, new edge created from the start of the edge to the new vertex
     * and inserted before current edge.
     * Current edge is trimmed and updated. Method returns new edge added.
     * @param {Edge} edge Edge to be split with new vertex and then trimmed from start
     * @param {Point} pt Point to be added as a new vertex
     * @returns {Edge}
     */
    addVertex(pt, edge) {
      let shapes = edge.shape.split(pt);
      if (shapes.length < 2) return;
      let newEdge = new Flatten.Edge(shapes[0]);
      let edgeBefore = edge.prev;

      /* Insert first split edge into linked list after edgeBefore */
      edge.face.insert(this.edges, newEdge, edgeBefore);

      // Remove old edge from edges container and 2d index
      this.edges.delete(edge);

      // Update edge shape with second split edge keeping links
      edge.shape = shapes[1];

      // Add updated edge to the edges container and 2d index
      this.edges.add(edge);
      return newEdge;
    }
    reverse() {
      for (let face of this.faces) {
        face.reverse();
      }
      return this;
    }

    /**
     * Create new copied instance of the polygon
     * @returns {Polygon}
     */
    clone() {
      let polygon = new Polygon();
      for (let face of this.faces) {
        let shapes = [];
        for (let edge of face) {
          shapes.push(edge.shape.clone());
        }
        polygon.addFace(shapes);
      }
      return polygon;
    }

    /**
     * Returns area of the polygon. Area of an island will be added, area of a hole will be subtracted
     * @returns {number}
     */
    area() {
      let signedArea = [...this.faces].reduce((acc, face) => acc + face.signedArea(), 0);
      return Math.abs(signedArea);
    }

    /**
     * Returns true if polygon contains point, including polygon boundary, false otherwise
     * Point in polygon test based on ray shooting algorithm
     * @param {Point} point - test point
     * @returns {boolean}
     */
    contains(point) {
      let rel = ray_shoot(this, point);
      return rel == Flatten.INSIDE || rel == Flatten.BOUNDARY ? true : false;
    }

    /**
     * Return distance and shortest segment between polygon and other shape as array [distance, shortest_segment]
     * @param {Shape} shape Shape of one of the types Point, Circle, Line, Segment, Arc or Polygon
     * @returns {Number | Segment}
     */
    distanceTo(shape) {
      let {
        Distance: Distance
      } = Flatten;
      if (shape instanceof Flatten.Point) {
        let [dist, shortest_segment] = Distance.point2polygon(shape, this);
        shortest_segment = shortest_segment.reverse();
        return [dist, shortest_segment];
      }
      if (shape instanceof Flatten.Circle || shape instanceof Flatten.Line || shape instanceof Flatten.Segment || shape instanceof Flatten.Arc) {
        let [dist, shortest_segment] = Distance.shape2polygon(shape, this);
        shortest_segment = shortest_segment.reverse();
        return [dist, shortest_segment];
      }

      /* this method is bit faster */
      if (shape instanceof Flatten.Polygon) {
        let min_dist_and_segment = [Number.POSITIVE_INFINITY, new Flatten.Segment()];
        let dist, shortest_segment;
        for (let edge of this.edges) {
          // let [dist, shortest_segment] = Distance.shape2polygon(edge.shape, shape);
          let min_stop = min_dist_and_segment[0];
          [dist, shortest_segment] = Distance.shape2planarSet(edge.shape, shape.edges, min_stop);
          if (Flatten.Utils.LT(dist, min_stop)) {
            min_dist_and_segment = [dist, shortest_segment];
          }
        }
        return min_dist_and_segment;
      }
    }

    /**
     * Return array of intersection points between polygon and other shape
     * @param shape Shape of the one of supported types <br/>
     * @returns {Point[]}
     */
    intersect(shape) {
      if (shape instanceof Flatten.Point) {
        return this.contains(shape) ? [shape] : [];
      }
      if (shape instanceof Flatten.Line) {
        return Polygon.intersectLine2Polygon(shape, this);
      }
      if (shape instanceof Flatten.Circle || shape instanceof Flatten.Segment || shape instanceof Flatten.Arc) {
        return Polygon.intersectShape2Polygon(shape, this);
      }
      if (shape instanceof Flatten.Polygon) {
        return Polygon.intersectPolygon2Polygon(shape, this);
      }
    }

    /**
     * Return true if polygon is valid for boolean operations
     * Polygon is valid if <br/>
     * 1. All faces are simple polygons (there are no self-intersected polygons) <br/>
     * 2. All faces are orientable and there is no island inside island or hole inside hole - TODO <br/>
     * 3. There is no intersections between faces (excluding touching) - TODO <br/>
     * @returns {boolean}
     */
    isValid() {
      let valid = true;
      // 1. Polygon is invalid if at least one face is not simple
      for (let face of this.faces) {
        if (!face.isSimple(this.edges)) {
          valid = false;
          break;
        }
      }
      // 2. TODO: check if no island inside island and no hole inside hole
      // 3. TODO: check the there is no intersection between faces
      return valid;
    }

    /**
     * Returns new polygon translated by vector vec
     * @param {Vector} vec
     * @returns {Polygon}
     */
    translate(vec) {
      let newPolygon = new Polygon();
      for (let face of this.faces) {
        let shapes = [];
        for (let edge of face) {
          shapes.push(edge.shape.translate(vec));
        }
        newPolygon.addFace(shapes);
      }
      return newPolygon;
    }

    /**
     * Return new polygon rotated by given angle around given point
     * If point omitted, rotate around origin (0,0)
     * Positive value of angle defines rotation counter clockwise, negative - clockwise
     * @param {number} angle - rotation angle in radians
     * @param {Point} center - rotation center, default is (0,0)
     * @returns {Polygon} - new rotated polygon
     */
    rotate(angle = 0, center = new Flatten.Point()) {
      let newPolygon = new Polygon();
      for (let face of this.faces) {
        let shapes = [];
        for (let edge of face) {
          shapes.push(edge.shape.rotate(angle, center));
        }
        newPolygon.addFace(shapes);
      }
      return newPolygon;
    }

    /**
     * Return new polygon transformed using affine transformation matrix
     * @param {Matrix} matrix - affine transformation matrix
     * @returns {Polygon} - new polygon
     */
    transform(matrix = new Flatten.Matrix()) {
      let newPolygon = new Polygon();
      for (let face of this.faces) {
        let shapes = [];
        for (let edge of face) {
          shapes.push(edge.shape.transform(matrix));
        }
        newPolygon.addFace(shapes);
      }
      return newPolygon;
    }
    static intersectShape2Polygon(shape, polygon) {
      let ip = [];
      if (polygon.isEmpty() || shape.box.not_intersect(polygon.box)) {
        return ip;
      }
      let resp_edges = polygon.edges.search(shape.box);
      for (let edge of resp_edges) {
        for (let pt of shape.intersect(edge.shape)) {
          ip.push(pt);
        }
      }
      return ip;
    }
    static intersectLine2Polygon(line, polygon) {
      let ip = [];
      if (polygon.isEmpty()) {
        return ip;
      }
      for (let edge of polygon.edges) {
        for (let pt of line.intersect(edge.shape)) {
          ip.push(pt);
        }
      }
      return ip;
    }
    static intersectPolygon2Polygon(polygon1, polygon2) {
      let ip = [];
      if (polygon1.isEmpty() || polygon2.isEmpty()) {
        return ip;
      }
      if (polygon1.box.not_intersect(polygon2.box)) {
        return ip;
      }
      for (let edge1 of polygon1.edges) {
        for (let pt of Polygon.intersectShape2Polygon(edge1.shape, polygon2)) {
          ip.push(pt);
        }
      }
      return ip;
    }

    /**
     * Return string to draw polygon in svg
     * @param attrs  - an object with attributes for svg path element,
     * like "stroke", "strokeWidth", "fill", "fillRule", "fillOpacity"
     * Defaults are stroke:"black", strokeWidth:"1", fill:"lightcyan", fillRule:"evenodd", fillOpacity: "1"
     * @returns {string}
     */
    svg(attrs = {}) {
      let {
        stroke: stroke,
        strokeWidth: strokeWidth,
        fill: fill,
        fillRule: fillRule,
        fillOpacity: fillOpacity,
        id: id,
        className: className
      } = attrs;
      // let restStr = Object.keys(rest).reduce( (acc, key) => acc += ` ${key}="${rest[key]}"`, "");
      let id_str = id && id.length > 0 ? "id=\"".concat(id, "\"") : "";
      let class_str = className && className.length > 0 ? "class=\"".concat(className, "\"") : "";
      let svgStr = "\n<path stroke=\"".concat(stroke || "black", "\" stroke-width=\"").concat(strokeWidth || 1, "\" fill=\"").concat(fill || "lightcyan", "\" fill-rule=\"").concat(fillRule || "evenodd", "\" fill-opacity=\"").concat(fillOpacity || 1.0, "\" ").concat(id_str, " ").concat(class_str, " d=\"");
      for (let face of this.faces) {
        svgStr += face.svg();
      }
      svgStr += "\" >\n</path>";
      return svgStr;
    }

    /**
     * This method returns an object that defines how data will be
     * serialized when called JSON.stringify() method
     * @returns {Object}
     */
    toJSON() {
      return [...this.faces].map(face => face.toJSON());
    }
  };
};
},{}],"node_modules/flatten-js/algorithms/distance.js":[function(require,module,exports) {
"use strict";

let IntervalTree = require('flatten-interval-tree');
module.exports = function (Flatten) {
  let {
    Polygon: Polygon,
    Point: Point,
    Segment: Segment,
    Arc: Arc,
    Circle: Circle,
    Line: Line,
    Ray: Ray,
    Vector: Vector
  } = Flatten;
  let {
    vector: vector
  } = Flatten;
  Flatten.Distance = class Distance {
    /**
     * Calculate distance and shortest segment between points
     * @param pt1
     * @param pt2
     * @returns {Number | Segment} - distance and shortest segment
     */
    static point2point(pt1, pt2) {
      return pt1.distanceTo(pt2);
    }

    /**
     * Calculate distance and shortest segment between point and line
     * @param pt
     * @param line
     * @returns {Number | Segment} - distance and shortest segment
     */
    static point2line(pt, line) {
      let closest_point = pt.projectionOn(line);
      let vec = vector(pt, closest_point);
      return [vec.length, new Segment(pt, closest_point)];
    }

    /**
     * Calculate distance and shortest segment between point and circle
     * @param pt
     * @param circle
     * @returns {Number | Segment} - distance and shortest segment
     */
    static point2circle(pt, circle) {
      let [dist2center, shortest_dist] = pt.distanceTo(circle.center);
      if (Flatten.Utils.EQ_0(dist2center)) {
        return [circle.r, new Segment(pt, circle.toArc().start)];
      } else {
        let dist = Math.abs(dist2center - circle.r);
        let v = vector(circle.pc, pt).normalize().multiply(circle.r);
        let closest_point = circle.pc.translate(v);
        return [dist, new Segment(pt, closest_point)];
      }
    }

    /**
     * Calculate distance and shortest segment between point and segment
     * @param pt
     * @param segment
     * @returns {Number | Segment} - distance and shortest segment
     */
    static point2segment(pt, segment) {
      /* Degenerated case of zero-length segment */
      if (segment.start.equalTo(segment.end)) {
        return Distance.point2point(pt, segment.start);
      }
      let v_seg = new Flatten.Vector(segment.start, segment.end);
      let v_ps2pt = new Flatten.Vector(segment.start, pt);
      let v_pe2pt = new Flatten.Vector(segment.end, pt);
      let start_sp = v_seg.dot(v_ps2pt);
      /* dot product v_seg * v_ps2pt */
      let end_sp = -v_seg.dot(v_pe2pt);
      /* minus dot product v_seg * v_pe2pt */

      let dist;
      let closest_point;
      if (Flatten.Utils.GE(start_sp, 0) && Flatten.Utils.GE(end_sp, 0)) {
        /* point inside segment scope */
        let v_unit = segment.tangentInStart(); // new Flatten.Vector(v_seg.x / this.length, v_seg.y / this.length);
        /* unit vector ||v_unit|| = 1 */
        dist = Math.abs(v_unit.cross(v_ps2pt));
        /* dist = abs(v_unit x v_ps2pt) */
        closest_point = segment.start.translate(v_unit.multiply(v_unit.dot(v_ps2pt)));
        return [dist, new Segment(pt, closest_point)];
      } else if (start_sp < 0) {
        /* point is out of scope closer to ps */
        return pt.distanceTo(segment.start);
      } else {
        /* point is out of scope closer to pe */
        return pt.distanceTo(segment.end);
      }
    }
    /**
     * Calculate distance and shortest segment between point and arc
     * @param pt
     * @param arc
     * @returns {Number | Segment} - distance and shortest segment
     */
    static point2arc(pt, arc) {
      let circle = new Flatten.Circle(arc.pc, arc.r);
      let dist_and_segment = [];
      let dist, shortest_segment;
      [dist, shortest_segment] = Distance.point2circle(pt, circle);
      if (shortest_segment.end.on(arc)) {
        dist_and_segment.push(Distance.point2circle(pt, circle));
      }
      dist_and_segment.push(Distance.point2point(pt, arc.start));
      dist_and_segment.push(Distance.point2point(pt, arc.end));
      Distance.sort(dist_and_segment);
      return dist_and_segment[0];
    }

    /**
     * Calculate distance and shortest segment between segment and line
     * @param seg
     * @param line
     * @returns {Number | Segment}
     */
    static segment2line(seg, line) {
      let ip = seg.intersect(line);
      if (ip.length > 0) {
        return [0, new Segment(ip[0], ip[0])]; // distance = 0, closest point is the first point
      }
      let dist_and_segment = [];
      dist_and_segment.push(Distance.point2line(seg.start, line));
      dist_and_segment.push(Distance.point2line(seg.end, line));
      Distance.sort(dist_and_segment);
      return dist_and_segment[0];
    }

    /**
     * Calculate distance and shortest segment between two segments
     * @param seg1
     * @param seg2
     * @returns {Number | Segment} - distance and shortest segment
     */
    static segment2segment(seg1, seg2) {
      let ip = Segment.intersectSegment2Segment(seg1, seg2);
      if (ip.length > 0) {
        return [0, new Segment(ip[0], ip[0])]; // distance = 0, closest point is the first point
      }

      // Seg1 and seg2 not intersected
      let dist_and_segment = [];
      dist_and_segment.push(Distance.point2segment(seg2.start, seg1));
      dist_and_segment.push(Distance.point2segment(seg2.end, seg1));
      dist_and_segment.push(Distance.point2segment(seg1.start, seg2));
      dist_and_segment.push(Distance.point2segment(seg1.end, seg2));
      Distance.sort(dist_and_segment);
      return dist_and_segment[0];
    }

    /**
     * Calculate distance and shortest segment between segment and circle
     * @param seg
     * @param circle
     * @returns {Number | Segment} - distance and shortest segment
     */
    static segment2circle(seg, circle) {
      /* Case 1 Segment and circle intersected. Return the first point and zero distance */
      let ip = seg.intersect(circle);
      if (ip.length > 0) {
        return [0, new Segment(ip[0], ip[0])];
      }

      // No intersection between segment and circle

      /* Case 2. Distance to projection of center point to line bigger than radius
       * And projection point belong to segment
        * Then measure again distance from projection to circle and return it */
      let line = new Flatten.Line(seg.ps, seg.pe);
      let [dist, shortest_segment] = Distance.point2line(circle.center, line);
      if (Flatten.Utils.GE(dist, circle.r) && shortest_segment.end.on(seg)) {
        return Distance.point2circle(shortest_segment.end, circle);
      }
      /* Case 3. Otherwise closest point is one of the end points of the segment */else {
        let [dist_from_start, shortest_segment_from_start] = Distance.point2circle(seg.start, circle);
        let [dist_from_end, shortest_segment_from_end] = Distance.point2circle(seg.end, circle);
        return Flatten.Utils.LT(dist_from_start, dist_from_end) ? [dist_from_start, shortest_segment_from_start] : [dist_from_end, shortest_segment_from_end];
      }
    }

    /**
     * Calculate distance and shortest segment between segment and arc
     * @param seg
     * @param arc
     * @returns {Number | Segment} - distance and shortest segment
     */
    static segment2arc(seg, arc) {
      /* Case 1 Segment and arc intersected. Return the first point and zero distance */
      let ip = seg.intersect(arc);
      if (ip.length > 0) {
        return [0, new Segment(ip[0], ip[0])];
      }

      // No intersection between segment and arc
      let line = new Flatten.Line(seg.ps, seg.pe);
      let circle = new Flatten.Circle(arc.pc, arc.r);

      /* Case 2. Distance to projection of center point to line bigger than radius AND
       * projection point belongs to segment AND
         * distance from projection point to circle belongs to arc  =>
         * return this distance from projection to circle */
      let [dist_from_center, shortest_segment_from_center] = Distance.point2line(circle.center, line);
      if (Flatten.Utils.GE(dist_from_center, circle.r) && shortest_segment_from_center.end.on(seg)) {
        let [dist_from_projection, shortest_segment_from_projection] = Distance.point2circle(shortest_segment_from_center.end, circle);
        if (shortest_segment_from_projection.end.on(arc)) {
          return [dist_from_projection, shortest_segment_from_projection];
        }
      }
      /* Case 3. Otherwise closest point is one of the end points of the segment */
      let dist_and_segment = [];
      dist_and_segment.push(Distance.point2arc(seg.start, arc));
      dist_and_segment.push(Distance.point2arc(seg.end, arc));
      let dist_tmp, segment_tmp;
      [dist_tmp, segment_tmp] = Distance.point2segment(arc.start, seg);
      dist_and_segment.push([dist_tmp, segment_tmp.reverse()]);
      [dist_tmp, segment_tmp] = Distance.point2segment(arc.end, seg);
      dist_and_segment.push([dist_tmp, segment_tmp.reverse()]);
      Distance.sort(dist_and_segment);
      return dist_and_segment[0];
    }

    /**
     * Calculate distance and shortest segment between two circles
     * @param circle1
     * @param circle2
     * @returns {Number | Segment} - distance and shortest segment
     */
    static circle2circle(circle1, circle2) {
      let ip = circle1.intersect(circle2);
      if (ip.length > 0) {
        return [0, new Segment(ip[0], ip[0])];
      }

      // Case 1. Concentric circles. Convert to arcs and take distance between two arc starts
      if (circle1.center.equalTo(circle2.center)) {
        let arc1 = circle1.toArc();
        let arc2 = circle2.toArc();
        return Distance.point2point(arc1.start, arc2.start);
      } else {
        // Case 2. Not concentric circles
        let line = new Line(circle1.center, circle2.center);
        let ip1 = line.intersect(circle1);
        let ip2 = line.intersect(circle2);
        let dist_and_segment = [];
        dist_and_segment.push(Distance.point2point(ip1[0], ip2[0]));
        dist_and_segment.push(Distance.point2point(ip1[0], ip2[1]));
        dist_and_segment.push(Distance.point2point(ip1[1], ip2[0]));
        dist_and_segment.push(Distance.point2point(ip1[1], ip2[1]));
        Distance.sort(dist_and_segment);
        return dist_and_segment[0];
      }
    }

    /**
     * Calculate distance and shortest segment between two circles
     * @param circle
     * @param line
     * @returns {Number | Segment} - distance and shortest segment
     */
    static circle2line(circle, line) {
      let ip = circle.intersect(line);
      if (ip.length > 0) {
        return [0, new Segment(ip[0], ip[0])];
      }
      let [dist_from_center, shortest_segment_from_center] = Distance.point2line(circle.center, line);
      let [dist, shortest_segment] = Distance.point2circle(shortest_segment_from_center.end, circle);
      shortest_segment = shortest_segment.reverse();
      return [dist, shortest_segment];
    }

    /**
     * Calculate distance and shortest segment between arc and line
     * @param arc
     * @param line
     * @returns {Number | Segment} - distance and shortest segment
     */
    static arc2line(arc, line) {
      /* Case 1 Line and arc intersected. Return the first point and zero distance */
      let ip = line.intersect(arc);
      if (ip.length > 0) {
        return [0, new Segment(ip[0], ip[0])];
      }
      let circle = new Flatten.Circle(arc.center, arc.r);

      /* Case 2. Distance to projection of center point to line bigger than radius AND
       * projection point belongs to segment AND
         * distance from projection point to circle belongs to arc  =>
         * return this distance from projection to circle */
      let [dist_from_center, shortest_segment_from_center] = Distance.point2line(circle.center, line);
      if (Flatten.Utils.GE(dist_from_center, circle.r)) {
        let [dist_from_projection, shortest_segment_from_projection] = Distance.point2circle(shortest_segment_from_center.end, circle);
        if (shortest_segment_from_projection.end.on(arc)) {
          return [dist_from_projection, shortest_segment_from_projection];
        }
      } else {
        let dist_and_segment = [];
        dist_and_segment.push(Distance.point2line(arc.start, line));
        dist_and_segment.push(Distance.point2line(arc.end, line));
        Distance.sort(dist_and_segment);
        return dist_and_segment[0];
      }
    }

    /**
     * Calculate distance and shortest segment between arc and circle
     * @param arc
     * @param circle2
     * @returns {Number | Segment} - distance and shortest segment
     */
    static arc2circle(arc, circle2) {
      let ip = arc.intersect(circle2);
      if (ip.length > 0) {
        return [0, new Segment(ip[0], ip[0])];
      }
      let circle1 = new Flatten.Circle(arc.center, arc.r);
      let [dist, shortest_segment] = Distance.circle2circle(circle1, circle2);
      if (shortest_segment.start.on(arc)) {
        return [dist, shortest_segment];
      } else {
        let dist_and_segment = [];
        dist_and_segment.push(Distance.point2circle(arc.start, circle2));
        dist_and_segment.push(Distance.point2circle(arc.end, circle2));
        Distance.sort(dist_and_segment);
        return dist_and_segment[0];
      }
    }

    /**
     * Calculate distance and shortest segment between two arcs
     * @param arc1
     * @param arc2
     * @returns {Number | Segment} - distance and shortest segment
     */
    static arc2arc(arc1, arc2) {
      let ip = arc1.intersect(arc2);
      if (ip.length > 0) {
        return [0, new Segment(ip[0], ip[0])];
      }
      let circle1 = new Flatten.Circle(arc1.center, arc1.r);
      let circle2 = new Flatten.Circle(arc2.center, arc2.r);
      let [dist, shortest_segment] = Distance.circle2circle(circle1, circle2);
      if (shortest_segment.start.on(arc1) && shortest_segment.end.on(arc2)) {
        return [dist, shortest_segment];
      } else {
        let dist_and_segment = [];
        let dist_tmp, segment_tmp;
        [dist_tmp, segment_tmp] = Distance.point2arc(arc1.start, arc2);
        if (segment_tmp.end.on(arc2)) {
          dist_and_segment.push([dist_tmp, segment_tmp]);
        }
        [dist_tmp, segment_tmp] = Distance.point2arc(arc1.end, arc2);
        if (segment_tmp.end.on(arc2)) {
          dist_and_segment.push([dist_tmp, segment_tmp]);
        }
        [dist_tmp, segment_tmp] = Distance.point2arc(arc2.start, arc1);
        if (segment_tmp.end.on(arc1)) {
          dist_and_segment.push([dist_tmp, segment_tmp.reverse()]);
        }
        [dist_tmp, segment_tmp] = Distance.point2arc(arc2.end, arc1);
        if (segment_tmp.end.on(arc1)) {
          dist_and_segment.push([dist_tmp, segment_tmp.reverse()]);
        }
        [dist_tmp, segment_tmp] = Distance.point2point(arc1.start, arc2.start);
        dist_and_segment.push([dist_tmp, segment_tmp]);
        [dist_tmp, segment_tmp] = Distance.point2point(arc1.start, arc2.end);
        dist_and_segment.push([dist_tmp, segment_tmp]);
        [dist_tmp, segment_tmp] = Distance.point2point(arc1.end, arc2.start);
        dist_and_segment.push([dist_tmp, segment_tmp]);
        [dist_tmp, segment_tmp] = Distance.point2point(arc1.end, arc2.end);
        dist_and_segment.push([dist_tmp, segment_tmp]);
        Distance.sort(dist_and_segment);
        return dist_and_segment[0];
      }
    }

    /**
     * Calculate distance and shortest segment between point and polygon
     * @param point
     * @param polygon
     * @returns {Number | Segment} - distance and shortest segment
     */
    static point2polygon(point, polygon) {
      let min_dist_and_segment = [Number.POSITIVE_INFINITY, new Segment()];
      for (let edge of polygon.edges) {
        let [dist, shortest_segment] = edge.shape instanceof Segment ? Distance.point2segment(point, edge.shape) : Distance.point2arc(point, edge.shape);
        if (Flatten.Utils.LT(dist, min_dist_and_segment[0])) {
          min_dist_and_segment = [dist, shortest_segment];
        }
      }
      return min_dist_and_segment;
    }
    static shape2polygon(shape, polygon) {
      let min_dist_and_segment = [Number.POSITIVE_INFINITY, new Segment()];
      for (let edge of polygon.edges) {
        let [dist, shortest_segment] = shape.distanceTo(edge.shape);
        if (Flatten.Utils.LT(dist, min_dist_and_segment[0])) {
          min_dist_and_segment = [dist, shortest_segment];
        }
      }
      return min_dist_and_segment;
    }

    /*
            static arc2polygon(arc, polygon) {
                let ip = arc.intersect(polygon);
                if (ip.length > 0) {
                    return [0, new Segment(ip[0], ip[0])];
                }
    
                let min_dist_and_segment = [Number.POSITIVE_INFINITY, new Segment()];
                for (let edge of polygon.edges) {
                    let [dist, shortest_segment] = arc.distanceTo(edge.shape);
                    if (Flatten.Utils.LT(dist, min_dist_and_segment[0])) {
                        min_dist_and_segment = [dist, shortest_segment];
                    }
                }
                return min_dist_and_segment;
            }
    
            static line2polygon(line, polygon) {
                let ip = line.intersect(polygon);
                if (ip.length > 0) {
                    return [0, new Segment(ip[0], ip[0])];
                }
    
                let min_dist_and_segment = [Number.POSITIVE_INFINITY, new Segment()];
                for (let edge of polygon.edges) {
                    let [dist, shortest_segment] = line.distanceTo(edge.shape);
                    if (Flatten.Utils.LT(dist, min_dist_and_segment[0])) {
                        min_dist_and_segment = [dist, shortest_segment];
                    }
                }
                return min_dist_and_segment;
            }
    
            static circle2polygon(circle, polygon) {
                let ip = circle.intersect(polygon);
                if (ip.length > 0) {
                    return [0, new Segment(ip[0], ip[0])];
                }
    
                let min_dist_and_segment = [Number.POSITIVE_INFINITY, new Segment()];
                for (let edge of polygon.edges) {
                    let [dist, shortest_segment] = circle.distanceTo(edge.shape);
                    if (Flatten.Utils.LT(dist, min_dist_and_segment[0])) {
                        min_dist_and_segment = [dist, shortest_segment];
                    }
                }
                return min_dist_and_segment;
            }
    */

    /**
     * Calculate distance and shortest segment between two polygons
     * @param polygon1
     * @param polygon2
     * @returns {Number | Segment} - distance and shortest segment
     */
    static polygon2polygon(polygon1, polygon2) {
      let min_dist_and_segment = [Number.POSITIVE_INFINITY, new Flatten.Segment()];
      for (let edge1 of polygon1.edges) {
        for (let edge2 of polygon2.edges) {
          let [dist, shortest_segment] = edge1.shape.distanceTo(edge2.shape);
          if (Flatten.Utils.LT(dist, min_dist_and_segment[0])) {
            min_dist_and_segment = [dist, shortest_segment];
          }
        }
      }
      return min_dist_and_segment;
    }

    /**
     * Returns [mindist, maxdist] array of squared minimal and maximal distance between boxes
     * Minimal distance by x is
     *    (box2.xmin - box1.xmax), if box1 is left to box2
     *    (box1.xmin - box2.xmax), if box2 is left to box1
     *    0,                       if box1 and box2 are intersected by x
     * Minimal distance by y is defined in the same way
     *
     * Maximal distance is estimated as a sum of squared dimensions of the merged box
     *
     * @param box1
     * @param box2
     * @returns {Number | Number} - minimal and maximal distance
     */
    static box2box_minmax(box1, box2) {
      let mindist_x = Math.max(Math.max(box1.xmin - box2.xmax, 0), Math.max(box2.xmin - box1.xmax, 0));
      let mindist_y = Math.max(Math.max(box1.ymin - box2.ymax, 0), Math.max(box2.ymin - box1.ymax, 0));
      let mindist = mindist_x * mindist_x + mindist_y * mindist_y;
      let box = box1.merge(box2);
      let dx = box.xmax - box.xmin;
      let dy = box.ymax - box.ymin;
      let maxdist = dx * dx + dy * dy;
      return [mindist, maxdist];
    }
    static minmax_tree_process_level(shape, level, min_stop, tree) {
      // Calculate minmax distance to each shape in current level
      // Insert result into the interval tree for further processing
      // update min_stop with maxdist, it will be the new stop distance
      let mindist, maxdist;
      for (let node of level) {
        // [mindist, maxdist] = Distance.box2box_minmax(shape.box, node.max);
        // if (Flatten.Utils.GT(mindist, min_stop))
        //     continue;

        // Estimate min-max dist to the shape stored in the node.item, using node.item.key which is shape's box
        [mindist, maxdist] = Distance.box2box_minmax(shape.box, node.item.key);
        if (node.item.value instanceof Flatten.Edge) {
          tree.insert([mindist, maxdist], node.item.value.shape);
        } else {
          tree.insert([mindist, maxdist], node.item.value);
        }
        if (Flatten.Utils.LT(maxdist, min_stop)) {
          min_stop = maxdist; // this will be the new distance estimation
        }
      }
      if (level.length === 0) return min_stop;

      // Calculate new level from left and right children of the current
      let new_level_left = level.map(node => node.left.isNil() ? undefined : node.left).filter(node => node !== undefined);
      let new_level_right = level.map(node => node.right.isNil() ? undefined : node.right).filter(node => node !== undefined);
      // Merge left and right subtrees and leave only relevant subtrees
      let new_level = [...new_level_left, ...new_level_right].filter(node => {
        // Node subtree quick reject, node.max is a subtree box
        let [mindist, maxdist] = Distance.box2box_minmax(shape.box, node.max);
        return Flatten.Utils.LE(mindist, min_stop);
      });
      min_stop = Distance.minmax_tree_process_level(shape, new_level, min_stop, tree);
      return min_stop;
    }

    /**
     * Calculates sorted tree of [mindist, maxdist] intervals between query shape
     * and shapes of the planar set.
     * @param shape
     * @param set
     */
    static minmax_tree(shape, set, min_stop) {
      let tree = new IntervalTree();
      let level = [set.index.root];
      let squared_min_stop = min_stop < Number.POSITIVE_INFINITY ? min_stop * min_stop : Number.POSITIVE_INFINITY;
      squared_min_stop = Distance.minmax_tree_process_level(shape, level, squared_min_stop, tree);
      return tree;
    }
    static minmax_tree_calc_distance(shape, node, min_dist_and_segment) {
      let min_dist_and_segment_new, stop;
      if (node != null && !node.isNil()) {
        [min_dist_and_segment_new, stop] = Distance.minmax_tree_calc_distance(shape, node.left, min_dist_and_segment);
        if (stop) {
          return [min_dist_and_segment_new, stop];
        }
        if (Flatten.Utils.LT(min_dist_and_segment_new[0], Math.sqrt(node.item.key.low))) {
          return [min_dist_and_segment_new, true]; // stop condition
        }
        let [dist, shortest_segment] = Distance.distance(shape, node.item.value);
        // console.log(dist)
        if (Flatten.Utils.LT(dist, min_dist_and_segment_new[0])) {
          min_dist_and_segment_new = [dist, shortest_segment];
        }
        [min_dist_and_segment_new, stop] = Distance.minmax_tree_calc_distance(shape, node.right, min_dist_and_segment_new);
        return [min_dist_and_segment_new, stop];
      }
      return [min_dist_and_segment, false];
    }

    /**
     * Calculates distance between shape and Planar Set of shapes
     * @param shape
     * @param {PlanarSet} set
     * @param {Number} min_stop
     * @returns {*}
     */
    static shape2planarSet(shape, set, min_stop = Number.POSITIVE_INFINITY) {
      let min_dist_and_segment = [min_stop, new Flatten.Segment()];
      let stop = false;
      if (set instanceof Flatten.PlanarSet) {
        let tree = Distance.minmax_tree(shape, set, min_stop);
        [min_dist_and_segment, stop] = Distance.minmax_tree_calc_distance(shape, tree.root, min_dist_and_segment);
      }
      return min_dist_and_segment;
    }
    static sort(dist_and_segment) {
      dist_and_segment.sort((d1, d2) => {
        if (Flatten.Utils.LT(d1[0], d2[0])) {
          return -1;
        }
        if (Flatten.Utils.GT(d1[0], d2[0])) {
          return 1;
        }
        return 0;
      });
    }
    static distance(shape1, shape2) {
      return shape1.distanceTo(shape2);
    }
  };
};
},{"flatten-interval-tree":"node_modules/flatten-interval-tree/index.js"}],"node_modules/flatten-js/index.js":[function(require,module,exports) {
/**
 * Created by Alex Bol on 2/18/2017.
 */
'use strict';

let Utils = require("./utils/utils");
let Errors = require("./utils/errors");

/**
 * FlattenJS - library for 2d geometry
 * @type {Flatten}
 */
let Flatten = class Flatten {
  constructor() {
    this.DP_TOL = Utils.DP_TOL;
    this.CCW = true;
    this.CW = false;
    this.ORIENTATION = {
      CCW: -1,
      CW: 1,
      NOT_ORIENTABLE: 0
    };
    this.PIx2 = 2 * Math.PI;
    // this.PI_2 = 0.5 * Math.PI;
    this.INSIDE = 1;
    this.OUTSIDE = 0;
    this.BOUNDARY = 2;
    this.CONTAINS = 3;
    this.INTERLACE = 4;
    this.OVERLAP_SAME = 1;
    this.OVERLAP_OPPOSITE = 2;
    this.Utils = Utils;
    this.Errors = Errors;
  }
};
let f = new Flatten();
require("./classes/matrix")(f);
require("./data_structures/planar_set")(f);
require("./classes/point")(f);
require("./classes/vector")(f);
require("./classes/line")(f);
require("./classes/circle")(f);
require("./classes/segment")(f);
require("./classes/arc")(f);
require("./classes/box")(f);
require("./classes/edge")(f);
require("./classes/face")(f);
require("./classes/ray")(f);
require("./algorithms/ray_shooting")(f);
require("./classes/polygon")(f);
require("./algorithms/distance")(f);
module.exports = f;
},{"./utils/utils":"node_modules/flatten-js/utils/utils.js","./utils/errors":"node_modules/flatten-js/utils/errors.js","./classes/matrix":"node_modules/flatten-js/classes/matrix.js","./data_structures/planar_set":"node_modules/flatten-js/data_structures/planar_set.js","./classes/point":"node_modules/flatten-js/classes/point.js","./classes/vector":"node_modules/flatten-js/classes/vector.js","./classes/line":"node_modules/flatten-js/classes/line.js","./classes/circle":"node_modules/flatten-js/classes/circle.js","./classes/segment":"node_modules/flatten-js/classes/segment.js","./classes/arc":"node_modules/flatten-js/classes/arc.js","./classes/box":"node_modules/flatten-js/classes/box.js","./classes/edge":"node_modules/flatten-js/classes/edge.js","./classes/face":"node_modules/flatten-js/classes/face.js","./classes/ray":"node_modules/flatten-js/classes/ray.js","./algorithms/ray_shooting":"node_modules/flatten-js/algorithms/ray_shooting.js","./classes/polygon":"node_modules/flatten-js/classes/polygon.js","./algorithms/distance":"node_modules/flatten-js/algorithms/distance.js"}],"coilcam-functions/boolean/Boolean-Union.js":[function(require,module,exports) {
"use strict";

var _flattenJs = _interopRequireDefault(require("flatten-js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var point = _flattenJs.default.point,
  polygon = _flattenJs.default.polygon;
var unify = _flattenJs.default.BooleanOperations.unify;
function getNumLayers(path0, path1) {
  //return larger number of layers
  var layers0 = new Set();
  var layers1 = new Set();
  layers0.forEach(function (p) {
    return path0.add(p[2]);
  });
  layers1.forEach(function (p) {
    return path1.add(p[2]);
  });
  return Math.max(layers0.size, layers1.size);
}
function union(path0, path1, radius) {
  //revise
  //assuming path0 is an array of points [x, y, z] -> [[1, 2, 3], [4, 5, 6], ...]
  //Flattenjs doesn't take in a tolerance
  layers0 = getNumLayers(path0);
  // let path = [];
  var path = [43.0];
  var _loop = function _loop(layer) {
    var points0 = path0.filter(function (p) {
      return p[2] == layer;
    }).map(function (p) {
      return point([p[0], p[1]]);
    });
    var points1 = path1.filter(function (p) {
      return p[2] == layer;
    }).map(function (p) {
      return point([p[0], p[1]]);
    });
    var polygon0 = new polygon(points0);
    var polygon1 = new polygon(points1);
    var combinedPolygon = unify(polygon0, polygon1);
    var filletedPolygon = combinedPolygon.fillet(radius);
    var combinedLayerPoints = filletedPolygon.vertices.map(function (vertex) {
      return [vertex.x, vertex.y];
    });
    path.push(combinedLayerPoints);
    path.push(3.0); //test
  };
  for (var layer = 0; layer < layers0.length; layer++) {
    _loop(layer);
  }
  console.log("Union path", path);
  return path;
}

//test:
/*
{
  let { point, segment, circle, arc, Polygon } = Flatten;
  const { unify } = Flatten.BooleanOperations;
  let pw = width / 48;
  let ph = height / 48;

  // Create new instance of polygon
  let polygon = new Polygon();
  let polygon1 = new Polygon();
 
const p1 = new Polygon([[0, 30], [30, 30], [30, 0], [0, 0]]);
const p2 = new Polygon([[20, 5], [20, 25], [40, 15]]);
const p3 = unify(p1, p2);
let combinedPolygonPoints = p3.vertices.map(vertex => [vertex.x, vertex.y]);


  let stage = d3.select(DOM.svg(width, height));

  // Add svg element to svg stage container
  stage.html(p3.svg());

  // return stage.node();
  return combinedPolygonPoints;
  // return JSON.stringify(combinedPolygonPoints);
}
*/
},{"flatten-js":"node_modules/flatten-js/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59724" + '/');
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","coilcam-functions/boolean/Boolean-Union.js"], null)
//# sourceMappingURL=/Boolean-Union.72ca2d64.js.map