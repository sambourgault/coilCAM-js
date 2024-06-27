/* eslint no-console:0 consistent-return:0 */
"use strict";


function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}

async function getExampleVessel(file){
  try{
    var response = await fetch(file);
    if(response.ok){
      var data = await response.text();
      return data;
    } 
  } catch(error){
    console.error('Error fetching file:', error);
  }
}

let path = []; //toolpath for vessel
let referencePath = []; //reference layer (optional)
let bedPath = []; //toolpath for bed
var potterbot_bedSize = [280, 265, 305];
let triangularizedPath = [];
let updatedPath = true;
let initialTranslation = [0, -50, -700];
var initialRotation = [degToRad(-45), degToRad(0), degToRad(10)];
var initialFieldOfView = degToRad(40);

function updatePath(newPath, refPath=[]){
  updatedPath = true;
  path = newPath;
  referencePath = refPath;
  main(initialTranslation,initialRotation, initialFieldOfView);
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

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

  gl.deleteProgram(program);
}

function main() {
  // Get A WebGL context
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl", { depth: true });
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
  setPath(gl, path, referencePath);

  var cameraAngleRadians = degToRad(0);
  var fieldOfViewRadians = initialFieldOfView;
  // var fieldOfViewRadians = degToRad(30);
  var translation = initialTranslation;
  var rotation = initialRotation;
  var scale = [1, 1, 1];
  var color = [Math.random(), Math.random(), Math.random(), 1];

  drawScene();
  
  if (updatedPath){
    drawScene();
    updatedPath = false;
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

  //prevent warping in the split window when window resized
  window.addEventListener("resize", (event) => { 
    drawScene();
  });
  const canvasResizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries){
      drawScene();
    }
  });
  canvasResizeObserver.observe(document.getElementById("canvas"));
  
  canvas.addEventListener("contextmenu", (event) => { //right click
    if (isDragging) {
      let deltaX = event.clientX - lastX;
      let deltaY = event.clientY - lastY;
      translation[0] += deltaX;
      translation[1] -= deltaY;
      initialTranslation = translation;
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
        initialTranslation = translation;
      } else{ //rotate model
        let factor = 1/100; // Rotation sensitivity
        rotation[0] += deltaY * factor;
        rotation[2] += deltaX * factor;
        initialRotation = rotation;
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
    initialFieldOfView = fieldOfViewRadians;
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

    // disable culling so that the base is double-sided
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
    matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Set the color/vars.
    var fColorLocation = gl.getUniformLocation(program, "fColor");
    var primitiveType = gl.LINE_STRIP;
    var offset = 22;

    // vessel
    gl.uniform4f(fColorLocation, 0.0, 0.0, 0.0, 1.0); // Set toolpath color to black
    if(path.length > 0){
      gl.drawArrays(gl.TRIANGLES, offset + referencePath.length*1.5, path.length*1.5 - offset); //correct?
    }

    // reference path
    gl.uniform4f(fColorLocation, 0.5, 0.6, 1.0, 1.0); // Set reference layer as light blue
    gl.drawArrays(gl.TRIANGLES, offset, referencePath.length*1.5);
  
    // // Draw the guidelines.
    gl.uniform4f(fColorLocation, 0.9, 0.9, 0.9, 1.0); // Set bed lines as light gray
    gl.drawArrays(gl.LINES, 6, 16); //next 16 vertices will be drawn as lines (base)

    // Draw the base.
    gl.uniform4f(fColorLocation, 0.7, 0.7, 0.7, 1.0); // Set bed color as gray
    gl.drawArrays(gl.TRIANGLES, 0, 6); //first 6 vertices will be drawn as triangles (base)
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


function addBedPath(){
  let bedXOffset = potterbot_bedSize[0]/2
  let bedYOffset = potterbot_bedSize[1]/2;

  let base_vertices = [
    potterbot_bedSize[0]*.5 + bedXOffset, potterbot_bedSize[1]*.5 + bedYOffset, -0.2,
    -potterbot_bedSize[0]*.5 + bedXOffset, -potterbot_bedSize[1]*.5 + bedYOffset, -0.2,
    potterbot_bedSize[0]*.5 + bedXOffset, -potterbot_bedSize[1]*.5 + bedYOffset, -0.2,
    -potterbot_bedSize[0]*.5 + bedXOffset, -potterbot_bedSize[1]*.5 + bedYOffset, -0.2,
    potterbot_bedSize[0]*.5 + bedXOffset, potterbot_bedSize[1]*.5 + bedYOffset, -0.2,
    -potterbot_bedSize[0]*.5 + bedXOffset, potterbot_bedSize[1]*.5 + bedYOffset, -0.2 
  ] //2 triangles, 6 points total
  return base_vertices;
}

function addPrinterGuidelines(){
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

function crossProduct(line1, line2){
  var magnitude = Math.sqrt(x * x + y * y + z * z);
  var x = (line1[1] * line2[2] - line1[2] * line2[1]);
  var y = (line1[2] * line2[0] - line1[0] * line2[2]);
  var z = (line1[0] * line2[1] - line1[1] * line2[0]);
  console.log(x, y, z);
  console.log(magnitude);
  return [x, y, z];
}

function triangularize(path){
  let trianglePath = [];
  for(let i = 0; i < path.length-4;i+=4){
    //vertical triangles
    let thicknessP1 = .5 + path[i+3];
    let thicknessP2 = .5 + path[i+7];

    let p1 = [path[i], path[i+1], path[i+2]];
    let p2 = [path[i+4], path[i+5], path[i+6]];

    trianglePath.push(path[i], path[i+1], path[i+2]+thicknessP1);
    trianglePath.push(path[i], path[i+1], path[i+2]-thicknessP1);
    trianglePath.push(path[i+4], path[i+5], path[i+6]-thicknessP2);

    trianglePath.push(path[i+4], path[i+5], path[i+6]+thicknessP2);
    trianglePath.push(path[i+4], path[i+5], path[i+6]-thicknessP2);
    trianglePath.push(path[i], path[i+1], path[i+2]+thicknessP1);
  }
  return trianglePath;
}

function setPath(gl, path, referencePath, bedDimensions) {
  bedPath = addBedPath(bedDimensions).concat(addPrinterGuidelines(bedDimensions)); //16 extra points
  let combinedPath = [];
  // console.log("path length", path.length);
  if(referencePath.length != 0){
    // combinedPath = bedPath.concat(referencePath).concat((path));
    combinedPath = bedPath.concat(triangularize(referencePath)).concat(triangularize(path));
  } else{
    combinedPath = bedPath.concat(triangularize(path));
  }
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(combinedPath),
    gl.STATIC_DRAW);
}

function setUpCodeMirror(){
  let textArea, textArea2;
  let editorCodeMirror;
  let consoleCodeMirror;

  // code editor: https://www.youtube.com/watch?v=C3fNuqQeUdY&t=1004s
  //code editor
  textArea = document.getElementById("editor");
  textArea.className = 'codemirror_textarea';

  // configs
  var pathToVessel = 'example_vessels/Starting_Vessel.js'; //name of vessel to be loaded as default
  editorCodeMirror = CodeMirror.fromTextArea(textArea, {
    lineNumbers: true,
    mode: 'javascript',
    extraKeys: {"Ctrl-Space": "autocomplete"},
  }); 
  editorCodeMirror.setSize("100%", "100%");
  getExampleVessel(pathToVessel) 
    .then(text => {editorCodeMirror.setValue(text)});
  
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
  consoleCodeMirror.setSize("100%", "100%");

  function printErrorToCodeMirror(errorString){
    consoleCodeMirror.replaceRange(`$ `+(errorString)+"\n", CodeMirror.Pos(consoleCodeMirror.lastLine()));
  }
  
  //dropdown menu
  const exampleVessels={  //list of all examples
    "example-cup":["example_vessels/CoilCAM_BooleanDemoCupV1.js"], 
    "example-vase":["example_vessels/CoilCAM_BooleanDemoDish.js"], 
    "example-plate":["example_vessels/CoilCAM_BumpsDish.js"]
  };

  for (let buttonID in exampleVessels){
    (function () {
    document.getElementById(buttonID).addEventListener("click", function() {
        let newText = getExampleVessel(exampleVessels[buttonID])
          .then(text => {editorCodeMirror.setValue(text)});
        editorCodeMirror.setValue(getExampleVessel(newText));
      },);
    }());
  }
  

  document.getElementById('b_upload').addEventListener('click', function() {
    document.getElementById('file_input').click(); //won't trigger when page loads
  }, {capture: true});
  
  //changes codemirror editor based on uploaded file
  document.getElementById('file_input').addEventListener('change', function(event) { 
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop();
      if (fileExtension === 'txt') {
        const reader = new FileReader();
        reader.onload = function(e) {
          const contents = e.target.result;
          editorCodeMirror.setValue(contents);
        };
        
        reader.onerror = function(e) {
          console.error('Error reading file:', e);
        };
        
        reader.readAsText(file);
      } else{
        consoleCodeMirror.replaceRange(`$ `+(`${"File name must end with .txt"}`)+"\n", CodeMirror.Pos(consoleCodeMirror.lastLine()));
      }
    }
  });


  



  document.getElementById("b_run").addEventListener("click", runCode);
  function runCode() {
    const codeToRun = editorCodeMirror.getValue();
    try {
      consoleCodeMirror.replaceRange(`$ `+eval(`${codeToRun}`)+"\n", CodeMirror.Pos(consoleCodeMirror.lastLine()));
    }
    catch(err){
      consoleCodeMirror.replaceRange(`$ `+err+"\n", CodeMirror.Pos(consoleCodeMirror.lastLine()));
    }
  }

  document.getElementById("b_save").addEventListener("click", saveCode, {capture: true});
  function saveCode(){
    let textInEditor = editorCodeMirror.getValue();
    var blob = new Blob([textInEditor], {type: "text/plain"});
    var anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "coilCAM-js.txt";
    anchor.click();
  }

  document.getElementById("b_docs").addEventListener("click", newTab, {capture: true});
  function newTab(){
    let newTab = document.createElement('a');
    newTab.href = "https://github.com/sambourgault/coilCAM-docs";
    newTab.target = "_blank";
    newTab.click();
  }

  document.getElementById("baby_pb").addEventListener("click", function(){changePrinterDims("baby")});
  document.getElementById("super_pb").addEventListener("click", function(){changePrinterDims("super")});
  
  function changePrinterDims(printerType){
    if (printerType == "baby"){
      potterbot_bedSize = [280, 265, 305];
      main(initialTranslation,initialRotation, initialFieldOfView);
    }
    if (printerType == "super"){
      potterbot_bedSize = [415, 405, 500];
      main(initialTranslation,initialRotation, initialFieldOfView);
    }
  }

  

  //Upload data
  document.getElementById('b_upload_files').addEventListener('click', function(){
    document.getElementById('upload_data').click();
  }, {capture: true});
  document.getElementById('upload_data').addEventListener('change', handleFiles);

  function addFileAsButton(filename, contents){ //add file to lefthand toolbar
    //add new button to dropbox area
    const newButton = document.createElement('uploaded_file_button');
    newButton.textContent = filename;
    newButton.classList.add('dynamic-button');

    //TOFIX: event listener to display file in new window on click
    newButton.addEventListener('click', function() {
      const dataBlob = new Blob([contents], { type: 'text/plain' });
      var dataFile = new File([dataBlob], filename, {type: "text/plain"});
      const dataUrl = URL.createObjectURL(dataFile);
      window.open(dataUrl);
    });
    
    
    //add trash button to new button to throw out unnecessary files
    const trashButton = document.createElement('trashButton');
    trashButton.textContent = '\u{2612}';
    trashButton.classList.add('trash-button');

    
    //event listener to remove file from localstorage
    let divName = 'uploaded-file-div_'+filename.split('.')[0]+filename.split('.')[1];
    trashButton.addEventListener('click', function() {
      console.log("throw out file", filename);
      localStorage.removeItem(filename);
      parent = document.getElementById(divName);
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
      document.getElementById('dropbox').removeChild(parent);
    });

    let parentElement = document.createElement('div');
    parentElement.id = divName;
    parentElement.className = 'uploaded-file-div';
    parentElement.classList.add('div');
    document.getElementById('dropbox').appendChild(parentElement);
    
    document.getElementById(divName).appendChild(trashButton);
    document.getElementById(divName).appendChild(newButton);
  }

  function handleFiles(event){ //adds file to sidebar
    const file = event.target.files[0];
    if (file) {
      var fileExtension = file.name.split('.').pop();
      if(localStorage.getItem(file.name) === null){ //file has unique name
        console.log("extension", fileExtension);
        let validExtensions = ['txt', 'wav', 'json', 'csv', 'mp3', 'mid']; //arbitrary, can be expanded
        if (validExtensions.includes(fileExtension)) { 
          var contents;
          const reader = new FileReader();
          reader.onload = function(e) {
            contents = e.target.result;
          };
          
          reader.onerror = function(e) {
            console.error('Error reading file:', e);
          };

          if(fileExtension == 'txt' || fileExtension == 'csv' || fileExtension == 'json' ){
            reader.readAsText(file); //keep original contents
          } else if(fileExtension == 'wav' || fileExtension == 'mp3'|| fileExtension == 'mid'){ //store as base64
            reader.readAsDataURL(file);
          }
          reader.onload = function () {
              contents = reader.result;
            try{
              localStorage.setItem(file.name, contents);
              addFileAsButton(file.name, contents);
            }catch(err){
              if(err.name === "QuotaExceededError"){
                printErrorToCodeMirror("File exceeds size limits.");
              }
            }
          };
        }
        else{
          printErrorToCodeMirror("File name must end with: "+validExtensions.join(" "));
        }
      }
      else{
        printErrorToCodeMirror("The file "+file.name+" already exists in localStorage.");
      }
    } else{
      printErrorToCodeMirror("Error uploading file."); 
    }
    
  }
  

  //drag + drop functionality
  let dropbox = document.getElementById("dropbox");
  dropbox.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
    dropbox.classList.add('dragging');
  });
  dropbox.addEventListener('dragleave', function(e) {
    e.preventDefault();
    e.stopPropagation();
    dropbox.classList.remove('dragging');
  });
  dropbox.addEventListener("dragenter", function(e){
    e.stopPropagation();
    e.preventDefault();
  });
  dropbox.addEventListener("drop", function(e) {
    e.stopPropagation();
    e.preventDefault();
    const dt = e.dataTransfer;
    const files = dt.files;
    dropbox.classList.remove('dragging');
    handleFiles({ target: { files: files } });
  });

  //load all files from localstorage on page load
  document.addEventListener('DOMContentLoaded', function(e){
    console.log("localstorage files");
    for(let i = 0; i < localStorage.length; i++) {
      addFileAsButton(localStorage.key(i), localStorage.getItem(localStorage.key(i)));
    }
  })
  

}

main();
setUpCodeMirror();
