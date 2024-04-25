//POTTERBOT
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 2.0;

//--Parameters for vessels
var nbLayers = 10;
var nbPointsInLayer = 12;
var radius = 10.0;


//RADIUS SHAPING PARAMETER
var rsp = staircase(2.6, 7.0, 0.0, nbPointsInLayer, [], "multiplicative");

//--Spout
//SCALING SHAPING PARAMETER
var spout_ssp = linear(0.63, 0.0, 60, [], "additive");
var spout_tsp = linear2D(0.712, 0.0, 0.0, 0.0, 0.0, 60, [], [], "")


// TOOLPATH UNIT GENERATORS
let vessels = [];
let num_copies = 5;
var toolpath = [];
for (let i = 0; i < num_copies; i++){
    vessels[i] = toolpathUnitGenerator([Math.sin(2*Math.PI/num_copies)*i, Math.cos(2*Math.PI/num_copies)*i, 0.0], radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, rsp, [], [], [], []);
    if(i > 0){
        toolpath.push = union(vessels[i-1], vessels[i]);
    }
}

// var toolpath = difference(baseToolpath, spoutToolpath);
updatePath(toolpath);
console.log(generateGCode(toolpath, potterbot_printSpeed, potterbot_nozzleDiameter, potterbot_layerHeight));