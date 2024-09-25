// POTTERBOT CONFIGURATION
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = potterbot_nozzleDiameter*.5;
var potterbot_extrusionMultiplier = 1.0;
var potterbot_bedSize = [280, 265, 305];

// VESSEL PARAMETERS
var nbLayers = 40;
var nbPointsInLayer = 5;
var vesselRadius = 80;
var position = [0, 0, potterbot_layerHeight*1.5];
var scalingParameter = sinusoidal(10, 60, 20, nbLayers, 0, "");
var thicknessParameter = sinusoidal(1, 5, 0, nbPointsInLayer, 0, "");

// BUILD VESSEL
var vessel = toolpathUnitGenerator(position, vesselRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], scalingParameter, [], [], [], [], []);
var b = base(position, vessel, nbPointsInLayer, potterbot_layerHeight, potterbot_nozzleDiameter, vesselRadius);
var toolpath = b.concat(spiralize(vessel, potterbot_layerHeight));
toolpath = centerPrint(toolpath, position, potterbot_bedSize, potterbot_layerHeight);
updatePath(toolpath);

// GENERATE GCODE
var gcode = generateGCode(toolpath, potterbot_nozzleDiameter, potterbot_printSpeed);

// SAVE GCODE
// downloadGCode(gcode, "CC_default_vessel.gcode"); 