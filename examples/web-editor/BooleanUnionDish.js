// STAR-SHAPED UNION DISH
// -- Dish by joining two toolpaths, where one toolpath is shaped by sine and linear functions.

// POTTERBOT CONFIGURATION
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 2.5;
var potterbot_bedSize = [280, 265, 305];

// VESSEL PARAMETERS
var nbLayers = 15;
var nbPointsInLayer = 60;
var radius = 76;
var mainRadius = 82;
var position = [0.0, 0.0, potterbot_layerHeight*3];

// -- Shaping parameters
var radiusParameter = sinusoidal(11.0, 12.0, 1.8, nbPointsInLayer, [], "multiplicative");
var scaleParameterValues0 = sinusoidal(2, 10.0, 30.0, nbLayers, [], "additive");
var scaleParameter = linear(1.1, 1, nbLayers, scaleParameterValues0, "additive");

// BUILD VESSEL
var starShapedToolpath = toolpathUnitGenerator(position, radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, radiusParameter, scaleParameter, [], [], [], [], []);
var mainToolpath = toolpathUnitGenerator(position, mainRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], [], [], [], [], [], []);
var toolpathBase = base(position, mainRadius, potterbot_layerHeight, nbPointsInLayer, potterbot_nozzleDiameter, mainToolpath);
var toolpath = spiralize(union(starShapedToolpath, mainToolpath), potterbot_layerHeight);
toolpath = (toolpathBase.concat(toolpath));
toolpath = centerPrint(toolpath, [0,0,0], potterbot_bedSize);
updatePath(toolpath);

// GENERATE GCODE
var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter);
//downloadGCode(gcode, "boolean_union_star_dish_example.gcode");