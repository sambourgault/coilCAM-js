//POTTERBOT
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 2.5;
var potterbot_bedSize = [280, 265, 305];

//--Parameters for vessels
var nbLayers = 17;
var nbPointsInLayer = 50;
var radius = 71.4;
var position = [0.0, 0.0, potterbot_layerHeight*4];

//RADIUS SHAPING PARAMETER
var rsp = sinusoidal(11.0, 10.0, 1.8, nbPointsInLayer, [], "multiplicative");
var ssp1 = sinusoidal(2,10.0, 30.0, nbLayers, [], "additive");
var ssp = linear(1.1,ssp1, nbLayers, [], "additive");
console.log("ssp", ssp);

// TOOLPATH UNIT GENERATORS
var vessel_star = toolpathUnitGenerator(position, radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, rsp, ssp, [], [], []);
var vesselRadius = 80.0;
var main_vessel = toolpathUnitGenerator(position, vesselRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], [], [], [], []);
var b = base(position, main_vessel, nbPointsInLayer, potterbot_layerHeight, potterbot_nozzleDiameter, vesselRadius);
var unspiralized = b.concat(union(vessel_star, main_vessel));
var spiralized = spiralize(union(vessel_star, main_vessel), potterbot_layerHeight);
var toolpath = (b.concat(spiralized));
toolpath = centerPrint(toolpath, position, potterbot_bedSize, potterbot_layerHeight);
updatePath(toolpath);
var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter, potterbot_printSpeed);
console.log(checkOverflow(toolpath, potterbot_bedSize, potterbot_layerHeight));

//downloadGCode(gcode, "dish_esmepuzio_V1");