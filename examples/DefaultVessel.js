// POTTERBOT CONFIGURATION
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = potterbot_nozzleDiameter*.5;

// VESSEL PARAMETERS
var nbLayers = 4;
var nbPointsInLayer = 4;
var vesselRadius = 10;
var position = [0, 1, 0];

// MANUALLY ADJUST RADIUS
var customRadius = updateLayer(vesselRadius, nbPointsInLayer);

// MANUALLY ADJUST PROFILE
var customProfile = updateProfile(potterbot_layerHeight, nbLayers);
console.log("customProfile offsets", customProfile);

// BUILD VESSEL
var vessel = toolpathUnitGenerator(position, vesselRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer, customRadius, customProfile, [], [], [], [], []);
updatePath(vessel);

// // SAVE GCODE
// downloadGCode(gcode, "CC_default_vessel.gcode"); 

// // STARTING VESSEL