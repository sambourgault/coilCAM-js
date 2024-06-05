// DEFAULT EXAMPLE

// POTTERBOT CONFIG
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 4.8;
var potterbot_extrusionMultiplier = 1.0;
var potterbot_bedSize = [280, 265, 305];


// VESSEL PARAMETERS
var nbLayers = 30;
var nbPointsInLayer = 6;
var vesselRadius = 40;
var position = [0, 0, potterbot_layerHeight*1.5];
var scalingParameter = sinusoidal(10, 40, 0.3, nbLayers, 0, "");
var vessel = toolpathUnitGenerator(position, vesselRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], scalingParameter, [], [], []);
var b = base(position, vessel, nbPointsInLayer, potterbot_layerHeight, potterbot_nozzleDiameter, vesselRadius);
var toolpath = b.concat(spiralize(vessel, potterbot_layerHeight));
updatePath(toolpath);

// GENERATE GCODE
var gcode_string = generateGCode(toolpath, potterbot_nozzleDiameter, potterbot_printSpeed);
// downloadGCode(gcode_string, "simple_vessel.gcode"); 