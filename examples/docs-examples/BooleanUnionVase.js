// Boolean Union Vase
// -- Complex example to demonstrate union between six smaller vessels and a main vase.

// POTTERBOT CONFIGURATION
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 6.0;
var potterbot_layerHeight = 2.5;
var potterbot_bedSize = [280, 265, 305];

// -- Parameters for 6 smaller vessels
var nbLayers = 50;
var nbPointsInLayer = 24;
var radius = 18.0;
let position = [0, 0, potterbot_layerHeight*2];
var rsp = sinusoidal(4.0, 6.0, 30.0, nbPointsInLayer, [], "multiplicative");
var ssp1 = sinusoidal(1,12.0, 55.0, nbLayers, [], "additive");
var ssp2 = linear(0.35, 1, nbLayers, ssp1, "additive");
var ssp3 = linear(-0.45, 4, nbLayers, ssp2, "additive");

var ssp = sinusoidal(2,30.0, -9.0, nbLayers, ssp3, "additive");

// -- Union smaller vessels
let vessels = [];
let num_copies = 6;
var bool_vessels = [];
for (let i = 0; i < num_copies; i++){
  	var rotateSP = sinusoidal(3.0, 5.0, 0, 12, [], "multiplicative");
    vessels[i] = toolpathUnitGenerator([(32)*Math.sin(i*2*Math.PI/num_copies),(32)*Math.cos(i*2*Math.PI/num_copies), position[2]], radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, rsp, ssp, [], [], (288*i)+240);
    if(i > 0){
        vessels[0] = union(vessels[i], vessels[0], true);
    }
}
bool_vessels = vessels[0];

// -- Build main cup
let vesselRadius = 45;
let main_vessel = toolpathUnitGenerator(position, vesselRadius, potterbot_layerHeight, nbLayers, nbPointsInLayer*1.5, [], [], [], [], [], []);
let toolpath = union(main_vessel, bool_vessels);

// -- Add base, spiralize, center
let lowerBase = baseFill([0, 0, 0], vesselRadius, nbPointsInLayer, potterbot_nozzleDiameter, toolpath);
let upperBase = baseFill([0, 0, potterbot_layerHeight], vesselRadius, nbPointsInLayer, potterbot_nozzleDiameter,toolpath, 0, 90);
toolpath = spiralize(toolpath, potterbot_layerHeight);
toolpath = lowerBase.concat(upperBase).concat(toolpath);
toolpath = centerPrint(toolpath, position, potterbot_bedSize, potterbot_layerHeight);
updatePath(toolpath);

// GENERATE GCODE
var gcode = generateGCode(toolpath, potterbot_layerHeight, potterbot_nozzleDiameter, potterbot_printSpeed);
//downloadGCode(gcode, "union_vase_example.gcode");
