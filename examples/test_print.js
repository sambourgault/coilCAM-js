//POTTERBOT
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 2.5;
var potterbot_bedSize = [280, 265, 305];

//--Parameters for vessels
var nbLayers = 55;
var nbPointsInLayer = 24;
var radius = 18.0;
let position = [0.0, 0.0, potterbot_layerHeight*4];

//RADIUS SHAPING PARAMETER
var rsp = sinusoidal(4.0, 7.0, 30.0, nbPointsInLayer, [], "multiplicative");
var ssp1 = sinusoidal(1,9.0, 55.0, nbLayers, [], "additive");
var ssp2 = linear(0.35,ssp1, nbLayers, [], "additive");
var ssp3 = linear(-0.45, 4, nbLayers, ssp2, "additive");

var ssp = sinusoidal(2,30.0, -9.0, nbLayers, ssp3, "additive");

// TOOLPATH UNIT GENERATORS
let vessels = [];
let num_copies = 5;
var bool_vessels = [];
for (let i = 0; i < num_copies; i++){
  	var rotateSP = sinusoidal(3.0, 5.0, 0, 12, [], "multiplicative");
    vessels[i] = toolpathUnitGenerator([(32)*Math.sin(i*2*Math.PI/num_copies),(32)*Math.cos(i*2*Math.PI/num_copies), position[2]], radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, rsp, ssp, [], [], (288*i)+240);
    if(i > 0){
        vessels[0] = union(vessels[i], vessels[0], true);
    }
}
bool_vessels = vessels[0];

let vesselRadius = 50;
let main_vessel = toolpathUnitGenerator(position, vesselRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer*1.5, [], [], [], [], []);
var b = base(position, main_vessel, nbPointsInLayer*1.5, potterbot_layerHeight, potterbot_nozzleDiameter, vesselRadius);
let toolpath = union(b, union(main_vessel, bool_vessels));
toolpath = centerPrint(toolpath, position, potterbot_bedSize, potterbot_layerHeight);
updatePath(toolpath);
var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter, potterbot_printSpeed);
console.log("gcode", gcode);
console.log(checkOverflow(toolpath, potterbot_bedSize, potterbot_layerHeight));
//downloadGCode(gcode, "microdemovessel.gcode");