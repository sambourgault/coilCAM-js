var stairOperator = staircase(10, 4, 0, 30, 30, 0, "");

var toolpath = toolpathUnitGenerator([0, 0, 0], 30, 3, 30, 50, [], stairOperator, [], [], [], []);
updatePath(spiralize(toolpath, 3));
