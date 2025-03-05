// CHECKERBOARD BOWL
// -- Bowl with checkerboard pattern from thickness parameter.

// POTTERBOT CONFIGURATION
var potterbot_nozzleDiameter = 4.0;
var potterbot_layerHeight = potterbot_nozzleDiameter/2;

// BOWL PARAMETERS
var position = [150, 150, potterbot_layerHeight*3];
var radius = 42;
var nbLayers = 24;
var nbPointsInLayer = nbLayers*2;

// -- Shaping parameters
var scaleParameter = sinusoidal(18, 84, -6.25, nbLayers, 0, "");
var rotationParameter = staircase(4, 32, 0, nbLayers, 0, "");
var thicknessParameter = square(1, nbPointsInLayer/8, 0, 4, nbLayers*nbPointsInLayer, 0, "");

// BUILD VESSEL
var toolpath = toolpathUnitGenerator(position, radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], scaleParameter, [], [], rotationParameter, thicknessParameter);
var toolpathBase = base(position, radius, potterbot_layerHeight, nbPointsInLayer, potterbot_nozzleDiameter, toolpath)
toolpath = toolpathBase.concat(toolpath);
toolpath = centerPrint(toolpath, [0,0,0]);  
updatePath(toolpath);

// GENERATE GCODE
var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter);
//downloadGCode(gcode, "checkerboard_bowl_example.gcode");