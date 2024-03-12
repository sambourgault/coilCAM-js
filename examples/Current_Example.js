//POTTERBOT
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 2.0;


//--Main Vessel
var nbLayers = 60;
var nbPointsInLayer = 42;

//--Spout
//SCALING SHAPING PARAMETER
var spout_ssp = linear(0.63, 0.0, 60, [], "additive");
var spout_tsp = linear2D(0.712, 0.0, 0.0, 0.0, 0.0, 60, [], [], "")


// TOOLPATH UNIT GENERATORS
var spoutToolpath = toolpathUnitGenerator([-18.0, 0.0, 7.0], 5.14, potterbot_layerHeight, 60.0, 3.0, [], spout_ssp, [], spout_tsp, []);

updatePath(spoutToolpath);
