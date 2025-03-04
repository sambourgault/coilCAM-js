// DIFFERENCE FUNCTION
var path1 = toolpathUnitGenerator([0, 0, 0], 30, 3, 30, 50, [], [], [], [], [], []);
var path2 = toolpathUnitGenerator([10, 35, 0], 30, 3, 30, 50, [], [], [], [], [], []);

var toolpath = difference(path1, path2);
updatePath(spiralize(toolpath, 3));
