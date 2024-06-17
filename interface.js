/* eslint no-console:0 consistent-return:0 */
"use strict";

function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}

async function getExampleVessel(){
  var response = await fetch('example_vessels/CoilCAM_SimpleVessel.js');
  var data = await response.text();
  return data;
}

let path = [];
let updatedPath = false;
var t = [0, -50, -500];
var r = [degToRad(-45), degToRad(0), degToRad(0)];

function updatePath(newPath){
  updatedPath = true;
  path = newPath;
  main(t,r);
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function main() {
  // Get A WebGL context
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // from webgl tutorials
  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-3d", "fragment-shader-3d"]);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");

  //var colorLocation = gl.getAttribLocation(program, "a_color");

  // lookup uniforms
  var colorLocation = gl.getUniformLocation(program, "u_color");
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Put geometry data into buffer
  //setGeometry(gl);
  setPath(gl, path);

  var cameraAngleRadians = degToRad(0);
  var fieldOfViewRadians = degToRad(30);

  

  //console.log(document.getElementById('canvas').width)
  //var translation = [document.getElementById('canvas').width, 500, 0];
  var translation = t;
  var rotation = r;
  var scale = [1, 1, 1];
  var color = [Math.random(), Math.random(), Math.random(), 1];

  

  drawScene();

  // Setup a ui.
  /*webglLessonsUI.setupSlider("#cameraAngle", {value: radToDeg(cameraAngleRadians), slide: updateCameraAngle, min: -360, max: 360});
  function updateCameraAngle(event, ui) {
    cameraAngleRadians = degToRad(ui.value);
    drawScene();
  }*/

  // // Setup a ui.
  // console.log("max:", gl.canvas.height);
  // webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), min: -gl.canvas.width, max: gl.canvas.width });
  // webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), min:-gl.canvas.height/2, max: gl.canvas.height/2});
  // webglLessonsUI.setupSlider("#z", {value: translation[2], slide: updatePosition(2), min: -1000, max: 0});
  // // webglLessonsUI.setupSlider("#z", {value: translation[2], slide: updatePosition(2), max: gl.canvas.height});
  // webglLessonsUI.setupSlider("#angleX", {value: radToDeg(rotation[0]), slide: updateRotation(0), max: 360});
  // webglLessonsUI.setupSlider("#angleY", {value: radToDeg(rotation[1]), slide: updateRotation(1), max: 360});
  // webglLessonsUI.setupSlider("#angleZ", {value: radToDeg(rotation[2]), slide: updateRotation(2), max: 360});
  // webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
  // webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
  // webglLessonsUI.setupSlider("#scaleZ", {value: scale[2], slide: updateScale(2), min: -5, max: 10, step: 0.01, precision: 2});

  
  if (updatedPath){
    drawScene();
    updatedPath = false;
  }

  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      t[index] =  ui.value;
      drawScene();
    };
  }

  function updateRotation(index) {
    return function(event, ui) {
      var angleInDegrees = ui.value;
      var angleInRadians = angleInDegrees * Math.PI / 180;
      rotation[index] = angleInRadians;
      r[index] = angleInRadians;
      drawScene();
    };
  }

  function updateScale(index) {
    return function(event, ui) {
      scale[index] = ui.value;
      drawScene();
    };
  }

  //drag canvas
  let isDragging = false;
  let lastX, lastY, lastZ;

  canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    lastZ = event.clientZ;
  });

  canvas.addEventListener("contextmenu", (event) => { //right click
    if (isDragging) {
      let deltaX = event.clientX - lastX;
      let deltaY = event.clientY - lastY;
      translation[0] += deltaX;
      translation[1] -= deltaY;
      drawScene();
      lastX = event.clientX;
      lastY = event.clientY;
    }
  });

  canvas.addEventListener('mousemove', (event) => {
    if (isDragging) {
      let deltaX = event.clientX - lastX;
      let deltaY = event.clientY - lastY;
      if (event.shiftKey) { //shift key, move model
        translation[0] += deltaX;
        translation[1] -= deltaY;
      } else{ //rotate model
        let factor = 1/100; // Rotation sensitivity
        rotation[0] += deltaY * factor;
        rotation[2] += deltaX * factor;
      }

      drawScene();
      lastX = event.clientX;
      lastY = event.clientY;
    }
  });

  canvas.addEventListener("wheel", (event) => { //zoom
    const zoomSpeed = 0.03;
    if (event.deltaY < 0) {
      fieldOfViewRadians -= zoomSpeed;
    } else { 
      fieldOfViewRadians += zoomSpeed;
    }
    drawScene();
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('mouseleave', () => {
    isDragging = false;
  });


  // Draw the scene.
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Turn on culling. By default backfacing triangles
    // will be culled.
    // gl.enable(gl.CULL_FACE);

    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);
   
    // Compute the matrices
    // var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
    var left = 0;
    var right = gl.canvas.clientWidth;
    var bottom = gl.canvas.clientHeight;
    var top = 0;
    var near = 500;
    var far = 0;
    // perspective: function(fieldOfViewInRadians, aspect, near, far)
    var matrix = m4.perspective(fieldOfViewRadians, gl.canvas.clientWidth / gl.canvas.clientHeight, near, far);
    // var matrix = m4.orthographic(left, right, bottom, top, near, far);
    matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Set the color.
    var fColorLocation = gl.getUniformLocation(program, "fColor");
    gl.uniform4f(fColorLocation, 0.0, 0.0, 0.0, 1.0); // Set toolpath color to black

    // Draw the toolpath.
    if(Array.isArray(path[0])){ //multiple vessels
      var primitiveType = gl.LINE_STRIP;
      let path_lengths = path[0].map(array => array.length);

      let points_printed = 0;
      for(let pl of path_lengths){
        gl.drawArrays(primitiveType, points_printed, pl/3);
        points_printed += (pl-1)/3;
      }
    } else{ //single toolpath
      var primitiveType = gl.LINE_STRIP;
      var offset = 0;
      var count = path.length/3;
      // gl.drawArrays(primitiveType, offset, count);
      gl.drawArrays(primitiveType, offset+22, count);
    }

    // Draw the base.
    gl.uniform4f(fColorLocation, 0.7, 0.7, 0.7, 1.0); // Set uniform variable for color to gray
    gl.drawArrays(gl.TRIANGLES, 0, 6); //first 6 vertices will be drawn as triangles (base)
    

    // Draw the guidelines. (inspired by p5.js)
    gl.uniform4f(fColorLocation, 0.9, 0.9, 0.9, 1.0); // Set uniform variable for color to gray
    gl.drawArrays(gl.LINES, 6, 22); //next 16 vertices will be drawn as lines (base)
    
    
  }
}

var m4 = {
  perspective: function(fieldOfViewInRadians, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ];
  },


  orthographic: function(left, right, bottom, top, near, far) {
    return [
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0,
      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1,
    ];
  },

  projection: function(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  },

  multiply: function(a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function(tx, ty, tz) {
    return [
       1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
       tx, ty, tz, 1,
    ];
  },

  xRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },

  yRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },

  zRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },

  scaling: function(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  },

  translate: function(m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function(m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },

  inverse: function(m) {
    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];
    var tmp_0  = m22 * m33;
    var tmp_1  = m32 * m23;
    var tmp_2  = m12 * m33;
    var tmp_3  = m32 * m13;
    var tmp_4  = m12 * m23;
    var tmp_5  = m22 * m13;
    var tmp_6  = m02 * m33;
    var tmp_7  = m32 * m03;
    var tmp_8  = m02 * m23;
    var tmp_9  = m22 * m03;
    var tmp_10 = m02 * m13;
    var tmp_11 = m12 * m03;
    var tmp_12 = m20 * m31;
    var tmp_13 = m30 * m21;
    var tmp_14 = m10 * m31;
    var tmp_15 = m30 * m11;
    var tmp_16 = m10 * m21;
    var tmp_17 = m20 * m11;
    var tmp_18 = m00 * m31;
    var tmp_19 = m30 * m01;
    var tmp_20 = m00 * m21;
    var tmp_21 = m20 * m01;
    var tmp_22 = m00 * m11;
    var tmp_23 = m10 * m01;

    var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    return [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
    ];
  },

  vectorMultiply: function(v, m) {
    var dst = [];
    for (var i = 0; i < 4; ++i) {
      dst[i] = 0.0;
      for (var j = 0; j < 4; ++j) {
        dst[i] += v[j] * m[j * 4 + i];
      }
    }
    return dst;
  },

};

// Fill the current ARRAY_BUFFER buffer
// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          // left column
            0,   0,  0,
           30,   0,  0,
            0, 150,  0,
            0, 150,  0,
           30,   0,  0,
           30, 150,  0,
 
          // top rung
           30,   0,  0,
          100,   0,  0,
           30,  30,  0,
           30,  30,  0,
          100,   0,  0,
          100,  30,  0,
 
          // middle rung
           30,  60,  0,
           67,  60,  0,
           30,  90,  0,
           30,  90,  0,
           67,  60,  0,
           67,  90,  0]),
      gl.STATIC_DRAW);
}

function addBasePath(){
  let potterbot_bedSize = [280, 265, 305]; //default
  let bedXOffset = potterbot_bedSize[0]/2
  let bedYOffset = potterbot_bedSize[1]/2;
  let base_vertices = [
    potterbot_bedSize[0]*.5 + bedXOffset, potterbot_bedSize[1]*.5 + bedYOffset, -0.2,
    -potterbot_bedSize[0]*.5 + bedXOffset, potterbot_bedSize[1]*.5 + bedYOffset, -0.2,
    potterbot_bedSize[0]*.5 + bedXOffset, -potterbot_bedSize[1]*.5 + bedYOffset, -0.2,
    -potterbot_bedSize[0]*.5 + bedXOffset, -potterbot_bedSize[1]*.5 + bedYOffset, -0.2,
    potterbot_bedSize[0]*.5 + bedXOffset, -potterbot_bedSize[1]*.5 + bedYOffset, -0.2,
    -potterbot_bedSize[0]*.5 + bedXOffset, potterbot_bedSize[1]*.5 + bedYOffset, -0.2
    
  ]
  return base_vertices;
}

function addPrinterGuidelines(){
  let potterbot_bedSize = [280, 265, 305]; //default
  let bedXOffset = potterbot_bedSize[0]/2
  let bedYOffset = potterbot_bedSize[1]/2;
  let bedZoffset = -0.2;
  let printer_guidelines = [
    potterbot_bedSize[0]*.5 + bedXOffset, potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset,
    potterbot_bedSize[0]*.5 + bedXOffset, potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset + potterbot_bedSize[2],

    -potterbot_bedSize[0]*.5 + bedXOffset, potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset,
    -potterbot_bedSize[0]*.5 + bedXOffset, potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset + potterbot_bedSize[2],

    -potterbot_bedSize[0]*.5 + bedXOffset, -potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset,
    -potterbot_bedSize[0]*.5 + bedXOffset, -potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset + potterbot_bedSize[2],

    potterbot_bedSize[0]*.5 + bedXOffset, -potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset,
    potterbot_bedSize[0]*.5 + bedXOffset, -potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset + potterbot_bedSize[2],

    
    potterbot_bedSize[0]*.5 + bedXOffset, potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset + potterbot_bedSize[2],
    -potterbot_bedSize[0]*.5 + bedXOffset, potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset + potterbot_bedSize[2],

    -potterbot_bedSize[0]*.5 + bedXOffset, potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset + potterbot_bedSize[2],
    -potterbot_bedSize[0]*.5 + bedXOffset, -potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset + potterbot_bedSize[2],

    -potterbot_bedSize[0]*.5 + bedXOffset, -potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset + potterbot_bedSize[2],
    potterbot_bedSize[0]*.5 + bedXOffset, -potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset + potterbot_bedSize[2],

    potterbot_bedSize[0]*.5 + bedXOffset, -potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset + potterbot_bedSize[2],
    potterbot_bedSize[0]*.5 + bedXOffset, potterbot_bedSize[1]*.5 + bedYOffset, bedZoffset + potterbot_bedSize[2],

  ] //16 points total
  return printer_guidelines;
}

function setPath(gl, path) {
  // path = path.concat(addBasePath());
  base = addBasePath().concat(addPrinterGuidelines()); //16 extra points
  path = base.concat(path);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(path),
    gl.STATIC_DRAW);
}

function setUpCodeMirror(){

  let textArea, textArea2;
  let myCodeMirror;
  let consoleCodeMirror;

  // code editor: https://www.youtube.com/watch?v=C3fNuqQeUdY&t=1004s
  //code editor
  textArea = document.getElementById("editor");
  textArea.className = 'codemirror_textarea';
  textArea.style.marginLeft = 20+'px';
  textArea.style.width = 140+'%';
  textArea.style.height = 200+'px';
  // textArea.value = '// Write your code here'; //text
  // console.log(getExampleVessel('example_vessels/CoilCAM_SimpleVessel.js').then((res) => console.log(res)));
  // textArea.value = getExampleVessel('example_vessels/CoilCAM_SimpleVessel.js').then((res) => res.toString());
  
  getExampleVessel('example_vessels/CoilCAM_SimpleVessel.js')
  .then(res => {
    textArea.value = res.toString();
  })
  .catch(err => {
    console.error('Error:', err);
  });
  
  // configs
  myCodeMirror = CodeMirror.fromTextArea(textArea, {
    lineNumbers: true,
    mode: 'javascript',
    extraKeys: {"Ctrl-Space": "autocomplete"},
  }); 

  
  // code editor console
  textArea2 = document.getElementById("console");
  textArea2.className = 'codemirror_textarea';
  textArea2.style.marginLeft = 20+'px';
  textArea2.style.width = 140+'%';
  textArea2.style.height = 200+'px';

  // configs
  consoleCodeMirror = CodeMirror.fromTextArea(textArea2, {
    lineNumbers: true,
    mode: 'javascript'
    //extraKeys: {"Ctrl-Space":"autocomplete"}
    
  });

  // buttons
  document.getElementById("b_run").addEventListener("click", runCode);

  function runCode() {
    const codeToRun = myCodeMirror.getValue();
    try {
      consoleCodeMirror.replaceRange(`$ `+eval(`${codeToRun}`)+"\n", CodeMirror.Pos(consoleCodeMirror.lastLine()));
    }
    catch(err){
      consoleCodeMirror.replaceRange(`$ `+err+"\n", CodeMirror.Pos(consoleCodeMirror.lastLine()));
    }
  }

  document.getElementById("b_save").addEventListener("click", saveCode);
  function saveCode(){
    // let content = myCodeMirror.getValue();
    // var content = document.getElementById("textArea").value;
    var editor = CodeMirror.fromTextArea(document.getElementById("textArea"), {styleActiveLine: true});
    var content = editor.doc.getValue();
    content = content.replace(/\n/g, "\r\n"); // To retain the Line breaks.
    let blob = new Blob([content], { type: "text/plain"});
    let filename = "code.txt";
    let anchor = document.createElement("a");
    anchor.download = filename;
    anchor.innerHTML = "Download File";
    window.URL = window.URL || window.webkitURL;
    anchor.href = window.URL.createObjectURL(blob);
    // anchor.target ="_blank";
    anchor.style.display = "none"; // just to be safe!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}

setUpCodeMirror();
main();