//POTTERBOT CONFIG
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 1.8;
var potterbot_extrusionMultiplier = 1.0;
var potterbot_bedSize = [280, 265, 305];


//--Main Vessel
var nbLayers = 60;
var nbPointsInLayer = 30;
var ssp = sinusoidal(20, 30, 0, nbLayers, 0, "");
//var ssp = sinusoidal2D(9.399, 50.0, 0.0, 50.0, 40, 12.5, [], "");
//var ssp = sinusoidal2D(-0.251, 48, 0.0, 0.0, nbLayers, ssp, "");
var toolpath_main = toolpathUnitGenerator([0.0, 0.0, 4.5], 42.00, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], ssp, [], [], []);

updatePath(toolpath_main);
