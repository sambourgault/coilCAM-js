// LINEAR FUNCTION
var linearOperator = linear(1.5, 4, 30, 0, "");

var toolpath = toolpathUnitGenerator([0, 0, 0], 30, 3, 30, 50, [], linearOperator, [], [], [], []);
updatePath(spiralize(toolpath, 3));
