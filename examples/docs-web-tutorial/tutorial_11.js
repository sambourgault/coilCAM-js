// INITIALIZATION PARAMETERS
var layerThickness = 6; //6 mm
var layerHeight = layerThickness * .5;
var position = [0, 0, layerHeight*2];
var radius = 40;
var nbLayers = 40;
var nbPointsInLayer = 50;


// SHAPING PARAMETERS
var radiusShapingParameter = sinusoidal(10, 10, 20, nbPointsInLayer, 0, "");
var scaleShapingParameter = sinusoidal(18, 60, -5.5, nbLayers, 0, "");
var linearScaleSP = linear(.02, -.4, nbLayers, 0, "");
var scalingRadiusParameter = sinusoidal(.7, 30, -12, nbLayers, linearScaleSP, "multiplicative");
var translateShapingParameter = sinusoidal2D(4, 30, 4, 20, 0, 0, nbLayers, 0, 0, "");
var rotateShapingParameter = exponential(2.1, 1.12, 1, -9, nbLayers, 0, "");
var thicknessShapingParameter = square(1, nbPointsInLayer/5, 0, 8, nbLayers*nbPointsInLayer, 0, "");

// GENERATE TOOLPATH
var toolpath = toolpathUnitGenerator(position, radius, layerHeight, nbLayers, nbPointsInLayer, radiusShapingParameter, scaleShapingParameter, scalingRadiusParameter, translateShapingParameter, rotateShapingParameter, thicknessShapingParameter);

// ADD BASE TO TOOLPATH
var b = base(position, 56, layerHeight, nbPointsInLayer, layerThickness, toolpath);
toolpath = b.concat(toolpath);

// SPIRALIZE
toolpath = spiralize(toolpath, layerHeight);

// CENTER PRINT
var potterbotBedSize = [280, 265, 305];
toolpath = centerPrint(toolpath, [0, 0, 0]);

// DISPLAY PATH
updatePath(toolpath);
