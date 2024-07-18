// Created by Sam Bourgault (https://github.com/sambourgault)

//POTTERBOT CONFIG
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 1.8;
var potterbot_extrusionMultiplier = 1.0;
var potterbot_bedSize = [280, 265, 305];

//--Main Vessel
var nbLayers = 40;
var ssp = sinusoidal2D(9.399, 50.0, 0.0, 50.0, 40, 12.5, [], "");
var ssp = sinusoidal2D(-0.251, 48, 0.0, 0.0, nbLayers, ssp, "");
var toolpath_main = toolpathUnitGenerator([0.0, 0.0, 4.5], 42.00, potterbot_layerHeight, 60, 30, [], ssp, [], [], []);

//--Subtracted vessel 1
var sub1_tsp = linear(-0.09, 0.0, 60.0, [], "");
var sub1_tsp = sinusoidal(4.0, 50.0, 7.0, [], sub1_tsp, "additive");
var toolpath_subtracted1 = toolpathUnitGenerator([19.0, 0.0, 4.5], 24.18, potterbot_layerHeight, 40, 30, [], [], [], sub1_tsp, []);

//--Subtracted vessel 2
var sub2_tsp = sinusoidal2D(9.399, 50, 2.543, 50.0, 40.0, 15.8, [], "");
var sub2_tsp = linear2D(0.388, 48, 0.0, 0.0, 40, sub2_tsp, "additive");
var toolpath_subtracted2 = toolpathUnitGenerator([-118.0, 0.0, 4.5], 24.18, potterbot_layerHeight, 40, 30, [], sub2_tsp, [], [], []);

var toolpath = difference(difference(toolpath_main, toolpath_subtracted2), toolpath_subtracted1);

//GCODE GENERATOR
// var gcode = generateGCode(path, nozzleDiameter, printSpeed, layerHeight);
console.log(toolpath);