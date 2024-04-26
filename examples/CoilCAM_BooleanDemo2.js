//POTTERBOT
var potterbot_printSpeed = 30;
var potterbot_nozzleDiameter = 5.0;
var potterbot_layerHeight = 2.0;

//--Parameters for vessels
var nbLayers = 40;
var nbPointsInLayer = 24;
var radius = 25.0;


//RADIUS SHAPING PARAMETER
var rsp = sinusoidal(4.0, 7.0, 30.0, nbPointsInLayer, [], "multiplicative");
var ssp1 = sinusoidal(0.5,10.0, 30.0, nbLayers, [], "additive");
var ssp = linear(-0.4,ssp1, nbLayers, [], "additive");


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

updatePath(toolpath);
console.log(generateGCode(toolpath, potterbot_printSpeed, potterbot_nozzleDiameter, potterbot_layerHeight));