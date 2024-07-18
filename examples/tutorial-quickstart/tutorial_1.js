// INITIALIZATION PARAMETERS
var layerThickness = 6; //6 mm
var layerHeight = layerThickness * .5;
var position = [0, 0, layerHeight*3];
var radius = 40;
var nbLayers = 40;
var nbPointsInLayer = 50;

// GENERATE TOOLPATH
var toolpath = toolpathUnitGenerator(position, radius, layerHeight, nbLayers, nbPointsInLayer, [], [], [], [], [], []);

// DISPLAY PATH
updatePath(toolpath);
