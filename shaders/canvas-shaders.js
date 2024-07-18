export const vertexShader3D = `
  attribute vec4 a_position;
  attribute vec4 a_color;
  
  uniform mat4 u_matrix;
  
  varying vec4 v_color;
  
  void main() {
    // Multiply the position by the matrix.
    gl_Position = u_matrix * a_position;
  
    // Pass the color to the fragment shader.
    v_color = a_color;
  }`;


export const fragmentShader3D = `
    precision mediump float;
    
    // Passed in from the vertex shader.
    varying vec4 v_color;
    uniform vec4 fColor;
    
    void main() {
      gl_FragColor = fColor;
    }
`;

export const vertexShader2D = `

  // an attribute will receive data from a buffer
  attribute vec4 a_position;

  // all shaders have a main function
  void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = a_position;
  }`;

export const fragmentShader2D = `

  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = vec4(0, 0.5, 0, 1); // return redish-purple
  }`;