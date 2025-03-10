// Created by Devon Frost for CoilCAM 

//POTTERBOT CONFIG
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 4.0;
var potterbot_layerHeight = 2;
var potterbot_extrusionMultiplier = 1.0;
var potterbot_bedSize = [280, 265, 305];

//--Main Vessel
var nbLayers = 60;
var ssp1 = linear(-0.09, 0.0, nbLayers, 0, "");
var ssp2 = sinusoidal(4.0, 50, 7.0, nbLayers, ssp1, "additive");
var toolpath_main = toolpathUnitGenerator([0.0, 0.0, 4.5], 42.00, potterbot_layerHeight, 60, 30, [], ssp2, [], [], [], []);

//--Subtracted vessel 1
var sub1_tsp1 = sinusoidal2D(9.399, 50, 0, 50, 12, 40, 0, 0, "");
var sub1_tsp2 = linear2D(-0.251, 48.0, 0.0, 0.0, 40.0, sub1_tsp1[0], sub1_tsp1[1], "additive");
var toolpath_subtracted1 = toolpathUnitGenerator([19.0, 0.0, 4.5], 24.18, potterbot_layerHeight, 40, 30, [], [], [], sub1_tsp2, []);
//--Subtracted vessel 2
var sub2_tsp1 = sinusoidal2D(9.399, 50, 0, 50, 15.8, 40, 0, 0, "");
var sub2_tsp2 = linear2D(0.388, 48, 0.0, 0.0, 40, sub2_tsp1[0], sub2_tsp1[1], "additive");
var toolpath_subtracted2 = toolpathUnitGenerator([-118.0, 0.0, 4.5], 24.18, potterbot_layerHeight, 40, 30, [], [], [], sub2_tsp2, [], []);

// TOOLPATH + GCODE
var toolpath = difference(difference(toolpath_main, toolpath_subtracted1), toolpath_subtracted2);
updatePath(toolpath);
var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter);
// download(gcode, "CoilCAM_MicroExampleMug.gcode");