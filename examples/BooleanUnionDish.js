// Star-Shaped Boolean Union Dish

// POTTERBOT CONFIGURATION
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 2.5;
var potterbot_bedSize = [280, 265, 305];

// VESSEL PARAMETERS
var nbLayers = 17;
var nbPointsInLayer = 50;
var radius = 71.4;
var position = [0.0, 0.0, potterbot_layerHeight*4];
var rsp = sinusoidal(11.0, 10.0, 1.8, nbPointsInLayer, [], "multiplicative");
var ssp1 = sinusoidal(2,10.0, 30.0, nbLayers, [], "additive");
var ssp = linear(1.1,ssp1, nbLayers, [], "additive");

// BUILD VESSEL
var vessel = toolpathUnitGenerator(position, radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, rsp, ssp, [], [], [], [], []);
// updatePath(vessel);

var vesselRadius = 80.0;
var main_vessel = toolpathUnitGenerator(position, vesselRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], [], [], [], [], [], []);
// updatePath(vessel, main_vessel);
var b = base(position, main_vessel, nbPointsInLayer, potterbot_layerHeight, potterbot_nozzleDiameter, vesselRadius);
var spiralized = spiralize(union(vessel, main_vessel), potterbot_layerHeight);
var toolpath = (b.concat(spiralized));
toolpath = centerPrint(toolpath, position, potterbot_bedSize, potterbot_layerHeight);
updatePath(toolpath);

// GENERATE GCODE
// var gcode = generateGCode(toolpath, potterbot_nozzleDiameter, potterbot_printSpeed);
//downloadGCode(gcode, "CC_boolean_union_dish.gcode");