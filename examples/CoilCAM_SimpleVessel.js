// POTTERBOT CONFIG
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 1.8;
var potterbot_extrusionMultiplier = 1.0;
var potterbot_bedSize = [280, 265, 305];


// Main Vessel
var nbLayers = 6;
var nbPointsInLayer = 3;
var vesselRadius = 20;
var scalingParameter = sinusoidal(10, 15, 0, nbLayers, 0, "");
var toolpath = toolpathUnitGenerator([0.0, 0.0, 4.5], 42.00, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], scalingParameter, [], [], []);

updatePath(toolpath);
var gcode_string = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter, potterbot_printSpeed);
downloadGCode(gcode_string, "vessel.gcode");