// UNION MUG
// -- Mug created by joining a vessel and a handle.
// -- Note: The handle is rotated so that the layer start of the handle
// -- is aligned with the layer start of the mug (this ensures a clean union).

// POTTERBOT CONFIGURATION
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = potterbot_nozzleDiameter/2;
var potterbot_bedSize = [280, 265, 305];

// SQUARE MUG PARAMETERS
var position = [0.0, 0.0, potterbot_layerHeight*2];
var radius = 42;
var nbLayers = 60;
var nbPointsInLayer = 60;

// HANDLE PARAMETERS
var position = [0.0, 0.0, potterbot_layerHeight*3];
var radius = 40;
var nbLayers = 35;

// -- Handle shaping parameters
var translationParameterAddition = sinusoidal(10, 70, 2, nbLayers, [], "additive"); //add sine waves to adjust handle offset
var translationParameter = sinusoidal2D(40, 60, 0, 1, -2.2, 0, nbLayers, translationParameterAddition, [], "additive");
var rotationParameter = 190; //rotate to align handle's layer start with mug's layer start

// BUILD VESSEL
var mugToolpath = toolpathUnitGenerator(position, radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], [], [], [], [], []);
var handleToolpath = toolpathUnitGenerator([25, 0, potterbot_layerHeight*2], radius/5, potterbot_layerHeight, nbLayers, 30, [], [], [], translationParameter, rotationParameter, []);
var toolpath = union(mugToolpath, handleToolpath);
var toolpathBase = base(position, radius, potterbot_layerHeight, nbPointsInLayer, potterbot_nozzleDiameter, toolpath);
toolpath = spiralize(toolpath, potterbot_layerHeight);
toolpath = toolpathBase.concat(toolpath);
toolpath = centerPrint(toolpath, [0,0,0], potterbot_bedSize);
updatePath(toolpath);

// GENERATE GCODE
var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter);
//downloadGCode(gcode, "union_mug_example.gcode");