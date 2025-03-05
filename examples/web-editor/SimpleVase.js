// SIMPLE VASE
// -- Vase with scale, rotation and thickness parameters.

// POTTERBOT CONFIGURATION
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = potterbot_nozzleDiameter*.5;
var potterbot_extrusionMultiplier = 1.0;
var potterbot_bedSize = [280, 265, 305];

// VESSEL PARAMETERS
var nbLayers = 50;
var nbPointsInLayer = 50;
var mainRadius = 35;
var position = [0, 0, potterbot_layerHeight*3];

// -- Shaping parameters
var scaleParameterValues0 = linear(-.2, 0, nbLayers, 0, "");
var scaleParameter = sinusoidal(12, 80, 20, nbLayers, scaleParameterValues0, "");
var rotationParameter = linear(1.5, 4, nbLayers, 0, "");
var thicknessParameter = sinusoidal(1, 5, 0, nbPointsInLayer, 0, "");

// BUILD VESSEL
var starShapedToolpath = toolpathUnitGenerator(position, mainRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], scaleParameter, [], [], rotationParameter, thicknessParameter);
var upperBase = baseSpiral(position, mainRadius+12, nbPointsInLayer, potterbot_nozzleDiameter);
var lowerBase = baseFill([0, 0, 0], mainRadius, nbPointsInLayer, potterbot_nozzleDiameter, starShapedToolpath);
var toolpath = lowerBase.concat(upperBase.concat(spiralize(starShapedToolpath, potterbot_layerHeight)));
toolpath = centerPrint(toolpath, [0, 0, 0]);
updatePath(toolpath);

// GENERATE GCODE
var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter);
// downloadGCode(gcode, "simple_vase_example.gcode"); 