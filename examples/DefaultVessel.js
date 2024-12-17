// Test Thickness Parameter

// POTTERBOT CONFIGURATION
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 6.0;
var potterbot_layerHeight = potterbot_nozzleDiameter*.5;
var potterbot_extrusionMultiplier = 1.0;
var potterbot_bedSize = [280, 265, 305];

// VESSEL PARAMETERS
var nbLayers = 50;
var nbPointsInLayer = 10;
var vesselRadius = 140;
var position = [0, 0, potterbot_layerHeight*1.5];
var scalingParameter = linear(-.8, 0, nbLayers, 0, "");
var thicknessParameter = sinusoidal(1, 2, 1.5, nbPointsInLayer*nbLayers, 0, "");
console.log("TP", thicknessParameter);
var rotate = linear(4, 0, nbLayers, 0, "");
var layerRotation = linear(45, 0, 40, 0, "");

// BUILD VESSEL
var vessel = toolpathUnitGenerator(position, vesselRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], scalingParameter, [], [], rotate, thicknessParameter);
var toolpath = spiralize(vessel, potterbot_layerHeight);
// toolpath = centerPrint(toolpath, position, potterbot_bedSize, potterbot_layerHeight);
updatePath(toolpath);

// GENERATE GCODE
var gcode = generateGC(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter, potterbot_printSpeed);
//  downloadGCode(gcode, "CC_Thickness-Test-Cone-FullRange.gcode"); 