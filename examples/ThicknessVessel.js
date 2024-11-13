// Simple Vase - Test Thickness Parameter

// POTTERBOT CONFIGURATION
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = potterbot_nozzleDiameter*.5;
var potterbot_extrusionMultiplier = 1.0;
var potterbot_bedSize = [280, 265, 305];

// VESSEL PARAMETERS
var nbLayers = 40;
var nbPointsInLayer = 15;
var vesselRadius = 40;
var position = [0, 0, potterbot_layerHeight*1.5];
var scalingParameter = sinusoidal(10, 60, 20, nbLayers, 0, "");
var thicknessParameter = sinusoidal(1, 5, 0, nbPointsInLayer, 0, "");
var layerRotation = linear(2, 0, 40, 0, "");

// BUILD VESSEL
var vessel = toolpathUnitGenerator(position, vesselRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], scalingParameter, [], [], layerRotation, thicknessParameter);
var toolpath = spiralize(vessel, potterbot_layerHeight);
toolpath = centerPrint(toolpath, position, potterbot_bedSize, potterbot_layerHeight);
updatePath(toolpath);

// GENERATE GCODE
var gcode = generateGC(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter, potterbot_printSpeed);
 downloadGCode(gcode, "thickness-test-noncumulative.gcode"); 