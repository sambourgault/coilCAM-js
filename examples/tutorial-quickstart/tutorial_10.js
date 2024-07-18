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
var translateShapingParameter = sinusoidal2D(4, 30, 4, 20, 0, 0, nbLayers, 0, 0, "");
var rotateShapingParameter = exponential(1.5, 1.12, 1, -9, nbLayers, 0, "");
var layerThicknessShapingParameter = linear(-.03, .8, nbLayers, 0, "");

// GENERATE TOOLPATH
var toolpath = toolpathUnitGenerator(position, radius, layerHeight, nbLayers, nbPointsInLayer, radiusShapingParameter, scaleShapingParameter, scalingRadiusParameter, translateShapingParameter, rotateShapingParameter, [[], layerThicknessShapingParameter]);

// ADD BASE TO TOOLPATH, SPIRALIZE AND CENTER
var b = base(position, toolpath, nbPointsInLayer, layerHeight, layerThickness, 53);
toolpath = b.concat(toolpath);
toolpath = spiralize(toolpath, layerHeight);
var potterbotBedSize = [280, 265, 305];
toolpath = centerPrint(toolpath, position, potterbotBedSize, layerHeight);

// PRINT GCODE
var potterbotNozzleDiameter = layerThickness;
var potterbotPrintSpeed = 30;
var gcodeString = generateGCode(toolpath, potterbotNozzleDiameter, potterbotPrintSpeed);
// downloadGCode(gcodeString, "demo_vase.gcode");

// DISPLAY PATH
updatePath(toolpath);
