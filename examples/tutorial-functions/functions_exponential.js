var exponentialOperator = exponential(-1.1, 1.07, 2, -10, 30, 0, "");

var toolpath = toolpathUnitGenerator([0, 0, 0], 30, 3, 30, 50, [], exponentialOperator, [], [], [], []);
updatePath(spiralize(toolpath, 3));
