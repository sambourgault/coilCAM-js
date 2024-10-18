// POTTERBOT CONFIGURATION
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = potterbot_nozzleDiameter*.5;

// VESSEL PARAMETERS
var nbLayers = 10;
var nbPointsInLayer = 4;
var vesselRadius = 10;
var position = [0, 0, potterbot_layerHeight*1.5];

// MANUALLY ADJUST PATH
var customRadius = updateLayer(vesselRadius, nbPointsInLayer);
console.log("custom radius:", customRadius);

// BUILD VESSEL
var vessel = tug(position, vesselRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer, customRadius, [], [], [], [], [], []);
console.log("vessel path", vessel);
updatePath(vessel);

// // SAVE GCODE
// downloadGCode(gcode, "CC_default_vessel.gcode"); 

// // STARTING VESSEL