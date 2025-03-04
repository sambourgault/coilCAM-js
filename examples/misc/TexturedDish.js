// Textured Dish

// POTTERBOT CONFIGURATION
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 2.5;
var potterbot_bedSize = [280, 265, 305];

// VESSEL PARAMETERS
var nbLayers = 10;
var nbPointsInLayer = 100;
var radius = 88;
var position = [0.0, 0.0, potterbot_layerHeight*3.5];
var radiusParameter = sinusoidal(2.0, 4.0, 1.0, nbPointsInLayer*nbLayers, [], "multiplicative");
var profileParameter = linear(1.1, 0, nbLayers, [], "additive");

// BUILD VESSEL
var vessel = toolpathUnitGenerator(position, radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, radiusParameter, profileParameter, [], [], [], []);
var b = base(position, radius, potterbot_layerHeight, nbPointsInLayer, potterbot_nozzleDiameter, vessel);
var spiralized = spiralize(vessel, potterbot_layerHeight);
var toolpath = (b.concat(spiralized));
// toolpath = centerPrint(toolpath, position, potterbot_bedSize, potterbot_layerHeight);
updatePath(toolpath);

// GENERATE GCODE
var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter);
// console.log(checkOverflow(toolpath, potterbot_bedSize, potterbot_layerHeight));
//downloadGCode(gcode, "CC_textured_dish.gcode");
