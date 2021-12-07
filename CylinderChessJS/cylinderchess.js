// chess rendering code
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = (u_ModelMatrix * a_Position);\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

const board = new Board();

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n==-1) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(.75, 0.0, 1, 1);


  // Get storage location of u_ModelMatrix
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) { 
      console.log('Failed to get the storage location of u_ModelMatrix');
      return;
  }
  // Model matrix
  var modelMatrix = new Matrix4();
  board.reset();

  canvas.onmousedown = function(ev){
    // our on clicker
    let pos = GetCanvasCoords(ev,canvas);
    let row=pos[1];
    let col=pos[0];
    if(board.selected()){
      board.moveSelected(row,col);
    }
    else{
      board.select(row,col);
    }
    UpdateDisplay();
  }
  
  var tick = function(){
    // moving to continuous redrawing
    Draw(gl,n,u_ModelMatrix,modelMatrix);
    requestAnimationFrame(tick,canvas);
  }
  tick();
}
function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    // Vertex coordinates and color
    
     0.0,  0.25,  0.0,  0.35,  0.15,  0.0, // The black square
     0.0, 0.0,  0.0,  0.35, 0.15,  0.0, // model = stringle strip
     0.25, 0.25,  0.0,  0.35,  0.15,  0.0, 
     0.25,  0.0,  0.0,  0.35,  0.15,  0.0, // count = 4

     0.0, 0.25,  0.0,  0.86,  0.71,  0.39, // The white square
     0.0, 0.0,  0.0,  0.86,  0.71,  0.39, // mode = traingle strip
     0.25, 0.25,  0.0,  0.86,  0.71,  0.39, 
     0.25, 0.0,  0.0,  0.68,  0.71,  0.39, //count = 4

     0.0,  0.25,  0.0,  0.0,  1.0,  0.0, // The black move to square
     0.0, 0.0,  0.0,  0.35, 0.15,  0.0, // model = stringle strip
     0.25, 0.25,  0.0,  0.35,  0.15,  0.0, 
     0.25,  0.0,  0.0,  0.35,  0.15,  0.0, // count = 4

     0.0, 0.25,  0.0,  0.0,  1.0,  0.0, // The white move to square
     0.0, 0.0,  0.0,  0.86,  0.71,  0.39, // mode = traingle strip
     0.25, 0.25,  0.0,  0.86,  0.71,  0.39, 
     0.25, 0.0,  0.0,  0.68,  0.71,  0.39, //count = 4

     0.0,  0.25,  0.0,  1.0,  0.0,  0.0, // The black captureable square
     0.0, 0.0,  0.0,  0.35, 0.15,  0.0, // model = stringle strip
     0.25, 0.25,  0.0,  0.35,  0.15,  0.0, 
     0.25,  0.0,  0.0,  0.35,  0.15,  0.0, // count = 4

     0.0, 0.25,  0.0,  1.0,  0.0,  0.0, // The white captureable to square
     0.0, 0.0,  0.0,  0.86,  0.71,  0.39, // mode = traingle strip
     0.25, 0.25,  0.0,  0.86,  0.71,  0.39, 
     0.25, 0.0,  0.0,  0.68,  0.71,  0.39, //count = 4

     0.0,  0.25,  0.0,  0.0,  0.0,  1.0, // The black selected square
     0.0, 0.0,  0.0,  0.35, 0.15,  0.0, // model = stringle strip
     0.25, 0.25,  0.0,  0.35,  0.15,  0.0, 
     0.25,  0.0,  0.0,  0.35,  0.15,  0.0, // count = 4

     0.0, 0.25,  0.0,  0.0,  0.0,  1.0, // The white selected to square
     0.0, 0.0,  0.0,  0.86,  0.71,  0.39, // mode = traingle strip
     0.25, 0.25,  0.0,  0.86,  0.71,  0.39, 
     0.25, 0.0,  0.0,  0.68,  0.71,  0.39, //count = 4

     0.06, 0.01, 0.25,  0.0, 0.0, 0.0, // the black king
     0.125, 0.24, 0.25,  0.0, 0.0, 0.0, // mode = triangles
     0.18, 0.01, 0.25,  0.0, 0.1, 0.1, 
     0.02, 0.01, 0.25,  0.1, 0.0, 0.0,
     0.02, 0.24, 0.25,  0.0, 0.0, 0.0,
     0.18, 0.01, 0.25,  0.0, 0.0, 0.0,
     0.06, 0.01, 0.25,  0.0, 0.0, 0.0,
     0.23, 0.24, 0.25,  0.0, 0.0, 0.0,
     0.23, 0.01, 0.25,  0.0, 0.0, 0.0, // count = 9

     0.05, 0.01, 0.25,  0.0, 0.0, 0.0, // the black queen
     0.02, 0.24, 0.25,  0.0, 0.0, 0.0, // mode = triangles
     0.125, 0.10, 0.25,  0.0, 0.0, 0.0, 
     0.125, 0.10, 0.25,  0.0, 0.0, 0.0, 
     0.20, 0.01, 0.25,  0.0, 0.0, 0.0,
     0.23, 0.24, 0.25,  0.0, 0.0, 0.0,
     0.02, 0.01, 0.25,  0.0, 0.0, 0.0,
     0.23, 0.01, 0.25,  0.0, 0.0, 0.0,
     0.125, 0.24, 0.25,  0.0, 0.0, 0.0,
     0.02, 0.01, 0.25,  0.0, 0.0, 0.0,
     0.07, 0.24, 0.25,  0.0, 0.0, 0.0,
     0.125, 0.12, 0.25,  0.0, 0.0, 0.0,
     0.125, 0.12, 0.25,  0.0, 0.0, 0.0,
     0.23, 0.01, 0.25,  0.0, 0.0, 0.0, 
     0.17, 0.24, 0.25,  0.0, 0.0, 0.0, // count = 15

     0.125, 0.24, 0.25,  0.0, 0.0, 0.0, // the black rook
     0.05, 0.24, 0.25,  0.0, 0.0, 0.0, // mode = triangle fan
     0.05, 0.17, 0.25,  0.0, 0.0, 0.0, 
     0.08, 0.125, 0.25,  0.0, 0.0, 0.0, 
     0.06, 0.01, 0.25,  0.0, 0.0, 0.0,
     0.19, 0.01, 0.25,  0.0, 0.0, 0.0,
     0.17, 0.125, 0.25,  0.0, 0.0, 0.0,
     0.20, 0.17, 0.25,  0.0, 0.0, 0.0,
     0.20, 0.24, 0.25,  0.0, 0.0, 0.0, // count = 9

     0.125, 0.17, 0.25,  0.0, 0.0, 0.0, // the black pawn
     0.125, 0.24, 0.25,  0.0, 0.0, 0.0, // mode = triangle fan
     0.05, 0.17, 0.25,  0.0, 0.0, 0.0, 
     0.08, 0.125, 0.25,  0.0, 0.0, 0.0, 
     0.06, 0.01, 0.25,  0.0, 0.0, 0.0,
     0.19, 0.01, 0.25,  0.0, 0.0, 0.0,
     0.17, 0.125, 0.25,  0.0, 0.0, 0.0,
     0.20, 0.17, 0.25,  0.0, 0.0, 0.0,
     0.125, 0.24, 0.25,  0.0, 0.0, 0.0, // count = 9

     0.125, 0.15, 0.25,  0.0, 0.0, 0.0, // the black bishop
     0.18, 0.185, 0.25,  0.0, 0.0, 0.0, // mode = triangle fan
     0.21, 0.15, 0.25,  0.0, 0.0, 0.0, 
     0.17, 0.125, 0.25,  0.0, 0.0, 0.0, 
     0.17, 0.01, 0.25,  0.0, 0.0, 0.0, 
     0.08, 0.01, 0.25,  0.0, 0.0, 0.0,
     0.08, 0.125, 0.25,  0.0, 0.0, 0.0,
     0.04, 0.15, 0.25,  0.0, 0.0, 0.0,
     0.125, 0.24, 0.25,  0.0, 0.0, 0.0,
     0.16, 0.20, 0.25,  0.0, 0.0, 0.0, // count = 10

     0.06, 0.01, 0.25,  0.0, 0.0, 0.0, // the black knight
     0.19, 0.01, 0.25,  0.0, 0.0, 0.0, // mode = traingles
     0.16, 0.07, 0.25,  0.0, 0.0, 0.0, 
     0.16, 0.07, 0.25,  0.0, 0.0, 0.0,
     0.06, 0.01, 0.25,  0.0, 0.0, 0.0,
     0.12, 0.10, 0.25,  0.0, 0.0, 0.0,
     0.12, 0.10, 0.25,  0.0, 0.0, 0.0, 
     0.06, 0.01, 0.25,  0.0, 0.0, 0.0,
     0.06, 0.19, 0.25,  0.0, 0.0, 0.0,
     0.06, 0.19, 0.25,  0.0, 0.0, 0.0,
     0.12, 0.10, 0.25,  0.0, 0.0, 0.0,
     0.12, 0.14, 0.25,  0.0, 0.0, 0.0,
     0.12, 0.14, 0.25,  0.0, 0.0, 0.0,
     0.06, 0.19, 0.25,  0.0, 0.0, 0.0,
     0.09, 0.20, 0.25,  0.0, 0.0, 0.0, 
     0.06, 0.19, 0.25,  0.0, 0.0, 0.0,
     0.09, 0.20, 0.25,  0.0, 0.0, 0.0,
     0.07, 0.23, 0.25,  0.0, 0.0, 0.0,
     0.12, 0.14, 0.25,  0.0, 0.0, 0.0,
     0.09, 0.20, 0.25,  0.0, 0.0, 0.0, 
     0.17, 0.18, 0.25,  0.0, 0.0, 0.0,
     0.17, 0.18, 0.25,  0.0, 0.0, 0.0,
     0.12, 0.14, 0.25,  0.0, 0.0, 0.0,
     0.17, 0.12, 0.25,  0.0, 0.0, 0.0,
     0.17, 0.12, 0.25,  0.0, 0.0, 0.0,
     0.17, 0.18, 0.25,  0.0, 0.0, 0.0,
     0.18, 0.15, 0.25,  0.0, 0.0, 0.0,

     0.06, 0.01, 0.25,  1.0, 1.0, 1.0, // the white king
     0.125, 0.24, 0.25,  1.0, 1.0, 1.0, // mode = triangles
     0.18, 0.01, 0.25,  1.0, 1.0, 1.0, 
     0.02, 0.01, 0.25,  1.0, 1.0, 1.0,
     0.02, 0.24, 0.25,  1.0, 1.0, 1.0,
     0.18, 0.01, 0.25,  1.0, 1.0, 1.0,
     0.06, 0.01, 0.25,  1.0, 1.0, 1.0,
     0.23, 0.24, 0.25,  1.0, 1.0, 1.0,
     0.23, 0.01, 0.25,  1.0, 1.0, 1.0, // count = 9

     0.05, 0.01, 0.25,  1.0, 1.0, 1.0, // the white queen
     0.02, 0.24, 0.25,  1.0, 1.0, 1.0, // mode = triangles
     0.125, 0.10, 0.25,  1.0, 1.0, 1.0, 
     0.125, 0.10, 0.25,  1.0, 1.0, 1.0, 
     0.20, 0.01, 0.25,  1.0, 1.0, 1.0,
     0.23, 0.24, 0.25,  1.0, 1.0, 1.0,
     0.02, 0.01, 0.25,  1.0, 1.0, 1.0,
     0.23, 0.01, 0.25,  1.0, 1.0, 1.0,
     0.125, 0.24, 0.25,  1.0, 1.0, 1.0,
     0.02, 0.01, 0.25,  1.0, 1.0, 1.0,
     0.07, 0.24, 0.25,  1.0, 1.0, 1.0,
     0.125, 0.12, 0.25,  1.0, 1.0, 1.0,
     0.125, 0.12, 0.25,  1.0, 1.0, 1.0,
     0.23, 0.01, 0.25,  1.0, 1.0, 1.0, 
     0.17, 0.24, 0.25,  1.0, 1.0, 1.0, // count = 15

     0.125, 0.24, 0.25,  1.0, 1.0, 1.0, // the white rook
     0.05, 0.24, 0.25,  1.0, 1.0, 1.0, // mode = triangle fan
     0.05, 0.17, 0.25,  1.0, 1.0, 1.0, 
     0.08, 0.125, 0.25,  1.0, 1.0, 1.0, 
     0.06, 0.01, 0.25,  1.0, 1.0, 1.0,
     0.19, 0.01, 0.25,  1.0, 1.0, 1.0,
     0.17, 0.125, 0.25,  1.0, 1.0, 1.0,
     0.20, 0.17, 0.25,  1.0, 1.0, 1.0,
     0.20, 0.24, 0.25,  1.0, 1.0, 1.0, // count = 9

     0.125, 0.17, 0.25,  1.0, 1.0, 1.0, // the white pawn
     0.125, 0.24, 0.25,  1.0, 1.0, 1.0, // mode = triangle fan
     0.05, 0.17, 0.25,  1.0, 1.0, 1.0, 
     0.08, 0.125, 0.25,  1.0, 1.0, 1.0, 
     0.06, 0.01, 0.25,  1.0, 1.0, 1.0,
     0.19, 0.01, 0.25,  1.0, 1.0, 1.0,
     0.17, 0.125, 0.25,  1.0, 1.0, 1.0,
     0.20, 0.17, 0.25,  1.0, 1.0, 1.0,
     0.125, 0.24, 0.25,  1.0, 1.0, 1.0, // count = 9

     0.125, 0.15, 0.25,  1.0, 1.0, 1.0, // the white bishop
     0.18, 0.185, 0.25,  1.0, 1.0, 1.0, // mode = triangle fan
     0.21, 0.15, 0.25,  1.0, 1.0, 1.0, 
     0.17, 0.125, 0.25,  1.0, 1.0, 1.0, 
     0.17, 0.01, 0.25,  1.0, 1.0, 1.0, 
     0.08, 0.01, 0.25,  1.0, 1.0, 1.0,
     0.08, 0.125, 0.25,  1.0, 1.0, 1.0,
     0.04, 0.15, 0.25,  1.0, 1.0, 1.0,
     0.125, 0.24, 0.25,  1.0, 1.0, 1.0,
     0.16, 0.20, 0.25,  1.0, 1.0, 1.0, // count = 10

     0.06, 0.01, 0.25,  1.0, 1.0, 1.0, // the white knight
     0.19, 0.01, 0.25,  1.0, 1.0, 1.0, // mode = traingles
     0.16, 0.07, 0.25,  1.0, 1.0, 1.0, 
     0.16, 0.07, 0.25,  1.0, 1.0, 1.0,
     0.06, 0.01, 0.25,  1.0, 1.0, 1.0,
     0.12, 0.10, 0.25,  1.0, 1.0, 1.0,
     0.12, 0.10, 0.25,  1.0, 1.0, 1.0, 
     0.06, 0.01, 0.25,  1.0, 1.0, 1.0,
     0.06, 0.19, 0.25,  1.0, 1.0, 1.0,
     0.06, 0.19, 0.25,  1.0, 1.0, 1.0,
     0.12, 0.10, 0.25,  1.0, 1.0, 1.0,
     0.12, 0.14, 0.25,  1.0, 1.0, 1.0,
     0.12, 0.14, 0.25,  1.0, 1.0, 1.0,
     0.06, 0.19, 0.25,  1.0, 1.0, 1.0,
     0.09, 0.20, 0.25,  1.0, 1.0, 1.0, 
     0.06, 0.19, 0.25,  1.0, 1.0, 1.0,
     0.09, 0.20, 0.25,  1.0, 1.0, 1.0,
     0.07, 0.23, 0.25,  1.0, 1.0, 1.0,
     0.12, 0.14, 0.25,  1.0, 1.0, 1.0,
     0.09, 0.20, 0.25,  1.0, 1.0, 1.0, 
     0.17, 0.18, 0.25,  1.0, 1.0, 1.0,
     0.17, 0.18, 0.25,  1.0, 1.0, 1.0,
     0.12, 0.14, 0.25,  1.0, 1.0, 1.0,
     0.17, 0.12, 0.25,  1.0, 1.0, 1.0,
     0.17, 0.12, 0.25,  1.0, 1.0, 1.0,
     0.17, 0.18, 0.25,  1.0, 1.0, 1.0,
     0.18, 0.15, 0.25,  1.0, 1.0, 1.0,
  ]);
  // n shall now be a dictionary
  var n = new dictionary();

  // adding our objects definition to our dictionary:
  // start is the vertex starting index
  // count is the number of vertices in the shape
  // start is itterated by the previous count before the new count is added
  // there might be a programatic way to load these from file or something, but i dont feel like working around cross-orgin errors
  {
    // satrt with base black tile
    var start = 0;
    var count = 4;
    n.putValue("blackbase",[start,count,gl.TRIANGLE_STRIP]);

    // move onto base white tile
    start += count;
    count = 4;
    n.putValue("whitebase",[start,count,gl.TRIANGLE_STRIP]);

    // the black move-to tile
    start += count;
    count =4;
    n.putValue("blackmove",[start,count,gl.TRIANGLE_STRIP]);

    // the white move-to tile
    start += count;
    count = 4;
    n.putValue("whitemove",[start,count,gl.TRIANGLE_STRIP]);

    // the black captureable tile
    start += count;
    count =4;
    n.putValue("blackcap",[start,count,gl.TRIANGLE_STRIP]);

    // the white captureable tile
    start += count;
    count = 4;
    n.putValue("whitecap",[start,count,gl.TRIANGLE_STRIP]);

    // the black selected tile
    start += count;
    count =4;
    n.putValue("blackselect",[start,count,gl.TRIANGLE_STRIP]);

    // the white selected tile
    start += count;
    count = 4;
    n.putValue("whiteselect",[start,count,gl.TRIANGLE_STRIP]);

    // the first piece: black king
    start += count;
    count = 9;
    n.putValue("blackking",[start,count,gl.TRIANGLES]);

    // the black queen
    start += count;
    count = 15;
    n.putValue("blackqueen",[start,count,gl.TRIANGLES]);

    // the black rook
    start += count;
    count = 9;
    n.putValue("blackrook",[start,count,gl.TRIANGLE_FAN]);

    // the black pawn
    start += count;
    count = 9;
    n.putValue("blackpawn",[start,count,gl.TRIANGLE_FAN]);

    // the black bishop
    start += count;
    count = 10;
    n.putValue("blackbishop",[start,count,gl.TRIANGLE_FAN]);

    // the black knight
    start += count;
    count = 27;
    n.putValue("blackknight",[start,count,gl.TRIANGLES]);

    // the white king
    start += count;
    count = 9;
    n.putValue("whiteking",[start,count,gl.TRIANGLES]);

    // the white queen
    start += count;
    count = 15;
    n.putValue("whitequeen",[start,count,gl.TRIANGLES]);

    // the black rook
    start += count;
    count = 9;
    n.putValue("whiterook",[start,count,gl.TRIANGLE_FAN]);

    // the black pawn
    start += count;
    count = 9;
    n.putValue("whitepawn",[start,count,gl.TRIANGLE_FAN]);

    // the black bishop
    start += count;
    count = 10;
    n.putValue("whitebishop",[start,count,gl.TRIANGLE_FAN]);

    // the black knight
    start += count;
    count = 27;
    n.putValue("whiteknight",[start,count,gl.TRIANGLES]);
  }

  // Create a buffer object
  var vertexColorbuffer = gl.createBuffer();  
  if (!vertexColorbuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Write the vertex information and enable it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  // Get the storage location of a_Position, assign buffer and enable
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  // Assign the buffer object to a_Color variable
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object

  return n;
}

function DrawBoard(gl,n,u_ModelMatrix,modelMatrix){
  // draws the board
  for(row=0;row<8;row++){
    let ty = (row-4)/4;
    for(col=0;col<8;col++){
      let offsetcol = (col+boardOffset)%8;
      let tx = (offsetcol-4)/4;
      // eventually:
      //tx += scrollOffset;
      colornumb = (row+col)%2;
      var colorname="white";
      if(colornumb==0){
        colorname="black";
      }
      colormodf = board.getTileType(row,col);
      // eventual: determine how color is modified
      objname = colorname+colormodf;
      if(DrawObject(gl,n,u_ModelMatrix,modelMatrix,objname,tx,ty)==-1){
        console.log("Error drawing object");
        return(-1);
      }
    }
  }
}

function DrawPieces(gl,n,u_ModelMatrix,modelMatrix){
  // draws the board
  for(row=0;row<8;row++){
    let ty = (row-4)/4;
    for(col=0;col<8;col++){
      let offsetcol = (col+boardOffset)%8;
      let tx = (offsetcol-4)/4;
      // eventually:
      //tx += scrollOffset;
      piece = board.at(row,col);
      if(piece!=0){
        DrawObject(gl,n,u_ModelMatrix,modelMatrix,piece,tx,ty);
      }
    }
  }
}

function Draw(gl,n,u_ModelMatrix,modelMatrix){
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  // draw the board
  DrawBoard(gl,n,u_ModelMatrix,modelMatrix);
  // draw the pieces
  DrawPieces(gl,n,u_ModelMatrix,modelMatrix);
}

// how many columns we are off
var boardOffset=0;
// the drawing offset
// i will get to this if/when i have time to do smooth scrolling
var scrollOffset=0;
function ScrollBoard(direction){
  switch(direction){
    case 'L':
      boardOffset-=1;
      boardOffset = (8+boardOffset)%8;
      break;
    case 'R':
      boardOffset+=1;
      boardOffset = boardOffset%8;
    default:
      break;
  }
}

function DrawObject(gl,n,u_ModelMatrix,modelMatrix,objname,px,py){
  shape = n.getValue(objname);
  if(shape===null){
    console.log("No shape of name: "+objname);
    return(-1);
  }
  else{
    modelMatrix.setTranslate(px,py,0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    start = shape[0]; // start index
    count = shape[1]; // vertex count
    model = shape[2]; // render mode
    gl.drawArrays(model,start,count);
    return(0);
  }
}

function GetCanvasCoords(ev,canvas){
  // this function returns the board row,column
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();
  // normalize assuming bottom left corner=0,0
  x=x-rect.left;
  y=canvas.height-(y-rect.top);
  // how many pixels per square?
  let squareheight = canvas.height/8;
  let squarewidth = canvas.width/8;
  // normalize
  x = Math.floor(x/squarewidth);
  x = (x+8-boardOffset)%8;
  y = Math.floor(y/squareheight);
  //console.log(x,y);
  return([x,y]);
}

function ResetBoard(){
  // listen for clicking reset button
  board.reset();
  boardOffset=0;
  scrollOffset=0;
  UpdateDisplay();
}

function UpdateDisplay(){
  // update current turn
  // will also show if there is a winner
  document.getElementById("turndisplay").innerHTML = board.currentTurn();
  // update the last move taken
  document.getElementById("lastmove").innerHTML = board.getLastMove();
  // update the mate display
  document.getElementById("matedisplay").innerHTML = board.currentStatus();
}

function UndoLastMove(){
  board.undoLastMove();
  UpdateDisplay();
}