//DEFAULT VESSEL
// POTTERBOT CONFIGURATION
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = potterbot_nozzleDiameter*2.5;
var potterbot_extrusionMultiplier = 1.0;
var potterbot_bedSize = [280, 265, 305];

// VESSEL PARAMETERS
var nbLayers = 3;
var nbPointsInLayer = 6;
var vesselRadius = 35;
var position = [0, 0, 0];
var scalingParameter = sinusoidal(10, 60, 20, nbLayers, 0, "");
var thicknessParameter = sinusoidal(1, 5, 0, nbPointsInLayer, 0, "");

// BUILD VESSEL
var vessel = toolpathUnitGenerator(position, vesselRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], scalingParameter, [], [], [], thicknessParameter, []);
var toolpath = spiralize(vessel, potterbot_layerHeight);
// toolpath = centerPrint(toolpath, position, potterbot_bedSize, potterbot_layerHeight);
var customToolpath = updatePath(toolpath);
console.log("custom toolpath:", customToolpath);

// GENERATE GCODE
var gcode = generateGC(customToolpath, potterbot_layerHeight, potterbot_nozzleDiameter, potterbot_printSpeed);
// downloadGCode(gcode, "test.gcode"); 