// CANDLE HOLDER
// -- Candle holder that uses a square wave to constrict the radius parameter.

// POTTERBOT CONFIGURATION
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = potterbot_nozzleDiameter/2;

// VESSEL PARAMETERS
var position = [0.0, 0.0, potterbot_layerHeight*2];
var radius = 30;
var nbLayers = 60;
var nbPointsInLayer = 50;

// -- Shaping parameters
var radiusParameter = sinusoidal(1.5, nbPointsInLayer/10, -1, nbLayers*nbPointsInLayer, [], "");
var scaleParameter = exponential(-1.1, 1.1, 0.5, 0, nbLayers, [], "");
var scalingParameter = square(1, nbLayers, 0, nbLayers/8, nbLayers, [], "");
var rotationParameter = linear(15, 0, nbLayers, 0, "");

// BUILD VESSEL
var toolpath = toolpathUnitGenerator(position, radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, radiusParameter, scaleParameter, scalingParameter, [], rotationParameter, []);
var toolpathBase = base(position, radius, potterbot_layerHeight, nbPointsInLayer, potterbot_nozzleDiameter, toolpath);
toolpath = toolpathBase.concat(spiralize(toolpath, potterbot_layerHeight));
updatePath(toolpath);

// GENERATE GCODE
var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter);
//downloadGCode(gcode, "candle_holder_example.gcode");