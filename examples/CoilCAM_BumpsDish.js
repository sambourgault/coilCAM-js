//POTTERBOT
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 2.5;
var potterbot_bedSize = [280, 265, 305];

//--Parameters for vessels
var nbLayers = 15;
var nbPointsInLayer = 100;
var radius = 85;
var position = [0.0, 0.0, potterbot_layerHeight*3.5];

//RADIUS SHAPING PARAMETER
var radsp = sinusoidal(2.0, 4.0, 1.0, nbPointsInLayer*nbLayers, [], "multiplicative");
var ssp1 = sinusoidal(2,10.0, 30.0, nbLayers, [], "additive");
var ssp = linear(1.1,ssp1, nbLayers, [], "additive");
console.log("radsp", radsp);

// TOOLPATH UNIT GENERATORS
var vessel_star = toolpathUnitGenerator(position, radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, radsp, ssp, [], [], []);
var b = base(position, vessel_star, nbPointsInLayer, potterbot_layerHeight, potterbot_nozzleDiameter, radius);
var spiralized = spiralize(vessel_star, potterbot_layerHeight);
var toolpath = (b.concat(spiralized));
toolpath = centerPrint(toolpath, position, potterbot_bedSize, potterbot_layerHeight);
updatePath(toolpath);
var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter, potterbot_printSpeed);
console.log(checkOverflow(toolpath, potterbot_bedSize, potterbot_layerHeight));

//downloadGCode(gcode, "bumpsdish_V1.gcode");

//check for bugs, ended abruptly