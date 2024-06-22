//POTTERBOT
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 2.5;
var potterbot_bedSize = [280, 265, 305];

//--Parameters for vessel
var nbLayers = 60;
var nbPointsInLayer = 42;
var main_position = [0.0, 0.0, 7.0];


//RADIUS SHAPING PARAMETER
var rsp = square(2.6, 7.0, 0.0, 3.0, nbPointsInLayer, [], "additive");

//SCALING SHAPING PARAMETER
var ssp1 = sinusoidal(0.4, 7.0, 0.3, nbLayers, [], "additive");
var ssp2 = linear(-0.033, 0.0, nbLayers, ssp1, "additive");
var ssp3 = sinusoidal(12.0, 63.0, 6.15, nbLayers, ssp2, "additive");

//SCALING RADIUS SHAPING PARAMETER
var srsp = linear(-0.03, 1.8, nbLayers, [], "additive");

//ROTATION PARAMETER
var rtsp = staircase(3.0, 30.0, 3.0, nbLayers, [], "");

//--Spout
//SCALING SHAPING PARAMETER
var spout_ssp = linear(0.63, 0.0, 60, [], "additive");
var spout_tsp = linear2D(0.712, 0.0, 0.0, 0.0, 0.0, 60, [], [], "")


// TOOLPATH UNIT GENERATORS
var baseToolpath = toolpathUnitGenerator(main_position, 48.16, potterbot_layerHeight, nbLayers=60, nbPointsInLayer=42, rsp, ssp3, srsp, [], rtsp);
var spoutToolpath = toolpathUnitGenerator([18.0, 0.0, 7.0+(potterbot_layerHeight*40)], 50.14, potterbot_layerHeight, nbLayers=60.0, nbPointsInLayer=3.0, [], spout_ssp, [], spout_tsp, []);
var toolpath = union(baseToolpath, spoutToolpath);
// var b = base(main_position, baseToolpath, nbPointsInLayer=42, potterbot_layerHeight, potterbot_nozzleDiameter, 48.16);
// toolpath = union(toolpath, b);
// toolpath = centerPrint(toolpath, main_position, potterbot_bedSize, potterbot_layerHeight);
updatePath(spoutToolpath, baseToolpath);
// console.log(generateGCode(toolpath, potterbot_printSpeed, potterbot_nozzleDiameter, potterbot_layerHeight));
// var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter, potterbot_printSpeed);
// console.log(checkOverflow(toolpath, potterbot_bedSize, potterbot_layerHeight));
//downloadGCode(gcode, "microdemovessel.gcode");