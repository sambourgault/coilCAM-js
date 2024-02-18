let f1 = linearFunction(2, 0, 10);
let toolpath = toolpathGenerator([0,0],  20,  2,  10,  10, f1);
let gcode = GCodeGenerator(toolpath, "BABY_POTTERBOT");

//preset = ["BABY_POTTERBOT", ""]
//"G1" + "X" + path[0].x + ""
