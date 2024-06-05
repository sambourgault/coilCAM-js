//POTTERBOT
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 2.0;

//--Parameters for vessels
var nbLayers = 10;
var nbPointsInLayer = 12;
var radius = 5.0;


//RADIUS SHAPING PARAMETER
var rsp = sinusoidal(4.0, 7.0, 30.0, nbPointsInLayer, [], "multiplicative");
var ssp = linear(-0.9,7.0, nbLayers, [], "additive");

// TOOLPATH UNIT GENERATORS
let vessels = [];
let num_copies = 5;
var base = [];
for (let i = 0; i < num_copies; i++){
  	var rotateSP = sinusoidal(3.0, 5.0, 0, 12, [], "multiplicative");
    vessels[i] = toolpathUnitGenerator([(30)*Math.sin(i*2*Math.PI/num_copies),(30)*Math.cos(i*2*Math.PI/num_copies), 0.0], radius, potterbot_layerHeight, nbLayers, nbPointsInLayer, rsp, ssp, [], [], (288*i)+240);
    if(i > 0){
        vessels[0] = union(vessels[i], vessels[0], true);
    }
}
base = vessels[0];
updatePath(base);
var num_points_bowl = 30;
var bowl_radius = sinusoidal(30.0, num_copies*20, -0.2, num_points_bowl, [], "additive");
let bowl = toolpathUnitGenerator([0.0, 0.0, 15.0], 30.0, potterbot_layerHeight, num_points_bowl, 60, [], bowl_radius, [], [], []);

var toolpath = union(base, bowl);
updatePath(toolpath);
console.log(generateGCode(toolpath, potterbot_printSpeed, potterbot_nozzleDiameter, potterbot_layerHeight));