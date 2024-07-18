var squareOperator = square(10, 10, 0, 4, 50, 0, "");

var toolpath = toolpathUnitGenerator([0, 0, 0], 30, 3, 30, 50, squareOperator, [], [], [], [], []);
updatePath(spiralize(toolpath, 3));
