// DEFAULT EXAMPLE

// POTTERBOT CONFIG
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 1.8;
var potterbot_extrusionMultiplier = 1.0;
var potterbot_bedSize = [280, 265, 305];


// Main Vessel
var nbLayers = 60;
var nbPointsInLayer = 30;
var vesselRadius = 20;
var position = [0, 0, 4.5];
var scalingParameter = sinusoidal(10, 15, 0, nbLayers, 0, "");
var toolpath = toolpathUnitGenerator(position, 42.00, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], scalingParameter, [], [], []);

var base = baseSpiral(position, toolpath, nbPointsInLayer, vesselRadius);
updatePath(toolpath);
var gcode_string = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter, potterbot_printSpeed);