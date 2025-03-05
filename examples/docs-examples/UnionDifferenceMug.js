// UNION DIFFERENCE MUG
// -- Mug with a handle made through a union function 
// -- and indentation made through a difference function.

// POTTERBOT CONFIGURATION
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5;
var potterbot_layerHeight = potterbot_nozzleDiameter*.5;
var potterbot_extrusionMultiplier = 1.0;
var potterbot_bedSize = [280, 265, 305];

// MAIN VESSEL PARAMETERS
var position = [150, 150, potterbot_layerHeight*2];
var radius = 48;
var nbLayers = 40;
var nbPointsInLayer = 50;

// HANDLE PARAMETERS (UNION)
var handlePosition = [140, 150, 20];
var handleRadius = 20;
var handleNbLayers = 34;
var handleNbPointsInLayer = 30;

// INDENT PARAMETERS (DIFFERENCE)
var indentPosition = [-10, 150, 50];
var indentRadius = 60;
var indentNbLayers = 22;
var indentNbPointsInLayer = 30;

// -- Shaping parameters for union and difference
var radiusParameter = sinusoidal(5, 15, 1.5, handleNbPointsInLayer, [], "");
var translateParameter = sinusoidal2D(60, 120, 5.3, 0.5, 5, 1, handleNbLayers, [], "");

// BUILD VESSEL
var mugToolpath = toolpathUnitGenerator(position, radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], [], [], [], [], []);
var handleToolpath = toolpathUnitGenerator(handlePosition, handleRadius, potterbot_layerHeight, handleNbLayers, handleNbPointsInLayer, radiusParameter, [], [], translateParameter, [], []);
var indentToolpath = toolpathUnitGenerator(indentPosition, indentRadius, potterbot_layerHeight, indentNbLayers, indentNbPointsInLayer, radiusParameter, [], [], translateParameter, [], []);
var toolpathBase = base(position, radius, potterbot_layerHeight, nbPointsInLayer, potterbot_nozzleDiameter, mugToolpath);
var toolpath = union(difference(mugToolpath, indentToolpath), handleToolpath);
toolpath = spiralize(toolpath, potterbot_layerHeight);
toolpath = toolpathBase.concat(toolpath);
updatePath(toolpath);

// GENERATE GCODE
var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter);
// downloadGCode(gcode, "union_difference_mug.gcode"); 