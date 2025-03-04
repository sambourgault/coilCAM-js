// INITIALIZATION PARAMETERS
var layerThickness = 6; //6 mm
var layerHeight = layerThickness * .5;
var position = [0, 0, layerHeight*3];
var radius = 40;
var nbLayers = 40;
var nbPointsInLayer = 50;


// SHAPING PARAMETERS
var radiusShapingParameter = sinusoidal(10, 10, 20, nbPointsInLayer, 0, "");
var scaleShapingParameter = sinusoidal(18, 60, -5.5, nbLayers, 0, "");
var linearScaleSP = linear(.02, -.4, nbLayers, 0, "");
var scalingRadiusParameter = sinusoidal(.7, 30, -12, nbLayers, linearScaleSP, "multiplicative");

// GENERATE TOOLPATH
var toolpath = toolpathUnitGenerator(position, radius, layerHeight, nbLayers, nbPointsInLayer, radiusShapingParameter, scaleShapingParameter, scalingRadiusParameter, [], [], []);

// DISPLAY PATH
updatePath(toolpath);
