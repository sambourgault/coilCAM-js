var sine2DOperator = sinusoidal2D(4, 30, 4, 20, 0, 30, 30, 0, 0, "");

var toolpath = toolpathUnitGenerator([0, 0, 0], 30, 3, 30, 50, [], [], [], sine2DOperator, [], []);
updatePath(spiralize(toolpath, 3));
