// DIFFERENCE CANDLE HOLDER
// -- Candle holder with a groove made through a difference function.

// POTTERBOT CONFIGURATION
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = potterbot_nozzleDiameter/2;

// VESSEL PARAMETERS
var position = [0.0, 0.0, potterbot_layerHeight*2];
var radius = 38;
var nbLayers = 60;
var nbPointsInLayer = 50;

// -- Shaping parameters
var radiusParameter = square(3, nbPointsInLayer/6, -1, nbPointsInLayer/20, nbPointsInLayer, [], "");
var scaleParameter = linear(-0.35, 0, nbLayers, [], "");
var grooveScaleParameter = exponential(-1.1, 1.1, 0.3, 0, nbLayers, [], "");
var translateParameter = linear2D(.25, 0, .25, 0, nbLayers, [],[], "");
var grooveTranslateParameter = linear2D(.45, 0, .45, 0, nbLayers, [],[], "");

// BUILD VESSEL
var toolpath = toolpathUnitGenerator(position, radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, radiusParameter, scaleParameter, [], translateParameter, [], []);
var toolpathBase = base(position, radius, potterbot_layerHeight, nbPointsInLayer, potterbot_nozzleDiameter, toolpath);
var differenceToolpath = toolpathUnitGenerator([-radius*3/5, -radius*3/5, potterbot_layerHeight*2], radius/3, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], grooveScaleParameter, [], grooveTranslateParameter, [], []);
toolpath = difference(toolpath, differenceToolpath);
toolpath = toolpathBase.concat(spiralize(toolpath, potterbot_layerHeight));
updatePath(toolpath);

// GENERATE GCODE
var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter);
//downloadGCode(gcode, "candle_holder_difference_example.gcode");