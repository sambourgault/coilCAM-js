// Created by Sam Bourgault for CoilCAM (https://github.com/sambourgault)

//POTTERBOT CONFIG
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
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
var gcode = generateGCode(toolpath, layerHeight, potterbot_nozzleDiameter);
// Boolean Union Vase
// -- Complex example to demonstrate union between six smaller vessels and a main vase

// POTTERBOT CONFIGURATION
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 6.0;
var potterbot_layerHeight = 2.5;
var potterbot_bedSize = [280, 265, 305];

// -- Parameters for 6 smaller vessels
var nbLayers = 50;
var nbPointsInLayer = 24;
var radius = 18.0;
let position = [0, 0, potterbot_layerHeight*2];
var rsp = sinusoidal(4.0, 6.0, 30.0, nbPointsInLayer, [], "multiplicative");
var ssp1 = sinusoidal(1,12.0, 55.0, nbLayers, [], "additive");
var ssp2 = linear(0.35, 1, nbLayers, ssp1, "additive");
var ssp3 = linear(-0.45, 4, nbLayers, ssp2, "additive");

var ssp = sinusoidal(2,30.0, -9.0, nbLayers, ssp3, "additive");

// -- Union smaller vessels
let vessels = [];
let num_copies = 6;
var bool_vessels = [];
for (let i = 0; i < num_copies; i++){
  	var rotateSP = sinusoidal(3.0, 5.0, 0, 12, [], "multiplicative");
    vessels[i] = toolpathUnitGenerator([(32)*Math.sin(i*2*Math.PI/num_copies),(32)*Math.cos(i*2*Math.PI/num_copies), position[2]], radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, rsp, ssp, [], [], (288*i)+240);
    if(i > 0){
        vessels[0] = union(vessels[i], vessels[0], true);
    }
}
bool_vessels = vessels[0];

// -- Build main cup
let vesselRadius = 45;
let main_vessel = toolpathUnitGenerator(position, vesselRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer*1.5, [], [], [], [], [], []);
let toolpath = union(main_vessel, bool_vessels);

// -- Add base, spiralize, center
let lowerBase = baseFill([0, 0, 0], vesselRadius, nbPointsInLayer, potterbot_nozzleDiameter, toolpath);
let upperBase = baseFill([0, 0, potterbot_layerHeight], vesselRadius, nbPointsInLayer, potterbot_nozzleDiameter,toolpath, 0, 90);
toolpath = spiralize(toolpath, potterbot_layerHeight);
toolpath = lowerBase.concat(upperBase).concat(toolpath);
toolpath = centerPrint(toolpath, position, potterbot_bedSize, potterbot_layerHeight);
updatePath(toolpath);

// GENERATE GCODE
var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter, potterbot_printSpeed);
//downloadGCode(gcode, "CC_microexamplemug.gcode");
