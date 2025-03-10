// Created by Devon Frost and Sam Bourgault for CoilCAM

// POTTERBOT CONFIG
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 2.5;
var potterbot_bedSize = [280, 265, 305];

//--Main Vessel
var nbLayers = 60;
var nbPointsInLayer = 42;
var main_position = [0.0, 0.0, potterbot_layerHeight*2];
var radius = 48;

// RADIUS SHAPING PARAMETER
var rsp = square(2.6, 7.0, 0.0, 3.0, nbPointsInLayer, [], "additive");

// SCALING SHAPING PARAMETER
var ssp1 = sinusoidal(0.4, 7.0, 0.3, nbLayers, [], "additive");
var ssp2 = linear(-0.033, 0.0, nbLayers, ssp1, "additive");
var ssp3 = sinusoidal(12.0, 63.0, 6.15, nbLayers, ssp2, "additive");

// SCALING RADIUS SHAPING PARAMETER
var srsp = linear(-0.03, 1.8, nbLayers, [], "additive");

// ROTATION PARAMETER
var rtsp = staircase(3.0, 30.0, 3.0, nbLayers, [], "");

//--Spout
// SCALING SHAPING PARAMETER
var spout_ssp = linear(0.63, 0.0, 60, [], "additive");
var spout_tsp = linear2D(0.712, 0.0, 0.0, 0.0, 60, [], [], "")

// TOOLPATH UNIT GENERATORS
var baseToolpath = toolpathUnitGenerator(main_position, radius, potterbot_layerHeight, nbLayers=60, nbPointsInLayer=42, rsp, ssp3, srsp, [], rtsp);
var spoutToolpath = toolpathUnitGenerator([-25.0, 0.0, potterbot_nozzleDiameter*2], 5, potterbot_layerHeight, nbLayers=58, nbPointsInLayer=3, [], spout_ssp, [], spout_tsp, []);
var toolpath = union(baseToolpath, spoutToolpath);
let lowerBase = baseFill([0, 0, 0], radius, nbPointsInLayer, potterbot_nozzleDiameter, baseToolpath);
let upperBase = baseSpiral([0, 0, potterbot_layerHeight], nbPointsInLayer, potterbot_nozzleDiameter, radius);
toolpath = lowerBase.concat(upperBase.concat(toolpath));
// toolpath = centerPrint(toolpath, main_position, potterbot_bedSize, potterbot_layerHeight);
updatePath(toolpath);

// GCODE
var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter, potterbot_printSpeed);
//downloadGCode(gcode, "CC_microdemovessel.gcode");