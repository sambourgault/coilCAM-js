// import { union } from "../coilcam-functions/boolean/BooleanUnion";

//POTTERBOT
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 2.0;

//--Parameters for vessel
var nbLayers = 60;
var nbPointsInLayer = 42;


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
var baseToolpath = toolpathUnitGenerator([0.0, 0.0, 7.0], 48.16, potterbot_layerHeight, nbLayers=60, nbPointsInLayer=42, rsp, ssp3, srsp, [], rtsp);
var spoutToolpath = toolpathUnitGenerator([100.0, 100.0, 7.0], 5.14, potterbot_layerHeight, nbLayers=60.0, nbPointsInLayer=3.0, [], spout_ssp, [], spout_tsp, []);
var toolpath = union(baseToolpath, spoutToolpath, 3.0);
// var toolpath = difference(baseToolpath, spoutToolpath);
updatePath(toolpath);
console.log(generateGCode(toolpath, potterbot_printSpeed, potterbot_nozzleDiameter, potterbot_layerHeight));