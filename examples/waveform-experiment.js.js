// DEFAULT EXAMPLE

// POTTERBOT CONFIG
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 4.8;
var potterbot_extrusionMultiplier = 1.0;
var potterbot_bedSize = [280, 265, 305];


// VESSEL PARAMETERS
var nbLayers = 40;
var nbPointsInLayer = 53;
var vesselRadius = 35;
var position = [0, 0, potterbot_layerHeight*1.5];
var scalingParameter = sinusoidal(10, 60, 20, nbLayers, 0, "");
// var thicknessParameter = sinusoidal(1, 5, 0, nbPointsInLayer, 0, "");
let wave = waveform('coilcam-d-scale.mid');
let thicknessParameter = wave.concat(new Array((nbPointsInLayer*nbLayers) - wave.length).fill(0));

var vessel = toolpathUnitGenerator(position, vesselRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], scalingParameter, [], [], [], [thicknessParameter, []]);
var refVessel = toolpathUnitGenerator(position, 60, potterbot_layerHeight, nbLayers, nbPointsInLayer, [], scalingParameter, [], [], [], [thicknessParameter, []]);
var b = base(position, vessel, nbPointsInLayer, potterbot_layerHeight, potterbot_nozzleDiameter, vesselRadius);
var toolpath = b.concat(spiralize(vessel, potterbot_layerHeight));
toolpath = centerPrint(toolpath, position, potterbot_bedSize, potterbot_layerHeight);
refVessel = centerPrint(refVessel, position, potterbot_bedSize, potterbot_layerHeight);


// console.log(audioThickness);
updatePath(toolpath, refVessel);

// GENERATE GCODE
var gcode_string = generateGCode(toolpath, potterbot_nozzleDiameter, potterbot_printSpeed);
console.log(gcode_string);
// downloadGCode(gcode_string, "simple_vessel.gcode"); 









// // let wave = waveform('coilCAM_test.wav');

// // POTTERBOT CONFIG
// var potterbot_printSpeed = 30;
// var potterbot_nozzleDiameter = 5.0;
// var potterbot_layerHeight = 4.8;
// var potterbot_extrusionMultiplier = 1.0;
// var bedDimensions = [280, 265, 305];
// // VESSEL PARAMETERS
// var nbLayers = 40;
// var nbPointsInLayer = 53;
// var vesselRadius = 35;
// var position = [0, 0, potterbot_layerHeight*1.5];
// var scalingParameter = sinusoidal(10, 60, 20, nbLayers, 0, "");

// updatePath(showCurve(scalingParameter, false, position, vesselRadius, potterbot_layerHeight, nbPointsInLayer, nbPointsInLayer));



