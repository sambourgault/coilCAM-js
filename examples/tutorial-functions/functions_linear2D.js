var linear2DOperator = linear2D(0.4, 1, 0.3, 0, 30, 0, "");

var toolpath = toolpathUnitGenerator([0, 0, 0], 30, 3, 30, 50, [], [], [], linear2DOperator, [], []);
updatePath(spiralize(toolpath, 3));
