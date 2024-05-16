//POTTERBOT
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 2.5;

//--Parameters for vessels
var nbLayers = 18;
var nbPointsInLayer = 50;
var radius = 61.8;
var position = [0.0, 0.0, potterbot_layerHeight*4];

//RADIUS SHAPING PARAMETER
var rsp = sinusoidal(11.0, 10.0, 1.8, nbPointsInLayer, [], "multiplicative");
var ssp1 = sinusoidal(3,10.0, 30.0, nbLayers, [], "additive");
var ssp = linear(1.4,ssp1, nbLayers, [], "additive");
console.log("ssp", ssp);

// TOOLPATH UNIT GENERATORS
var vessel_star = toolpathUnitGenerator(position, radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, rsp, ssp, [], [], []);
var vesselRadius = 75.0;
var main_vessel = toolpathUnitGenerator(position, vesselRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], [], [], [], []);
var b = base(position, main_vessel, nbPointsInLayer, potterbot_layerHeight, potterbot_nozzleDiameter, vesselRadius);
var spiralized = spiralize(union(vessel_star, main_vessel), potterbot_layerHeight);
var toolpath = b.concat(spiralized);
updatePath(toolpath);
var gcode = generateGCode(toolpath, potterbot_printSpeed, potterbot_nozzleDiameter, potterbot_layerHeight);