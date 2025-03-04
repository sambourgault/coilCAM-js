var sineOperator = sinusoidal(3, 12, 5, 30, 0, "");

var toolpath = toolpathUnitGenerator([0, 0, 0], 30, 3, 30, 50, [], sineOperator, [], [], [], []);
updatePath(spiralize(toolpath, 3));
