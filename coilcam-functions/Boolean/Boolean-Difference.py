"""Provides a scripting component.
    Inputs:
        x: The x script variable
        y: The y script variable
    Output:
        a: The a output variable"""

__author__ = "sami_"
__version__ = "2022.07.05"

import rhinoscriptsyntax as rs
import Rhino

path = []
stops = []
stopPoints = []

index0 = 0
index1 = 0

globalIndex = 0

if len(path0) != 0:
    currentHeight = path0[0].Z
    
    while index0 < len(path0) or index1 < len(path1):
        curves = []
        
        #create curve with path0 layer
        points0 = []
        if index0 < len(path0):
            points0.append(rs.CreatePoint(path0[index0].X, path0[index0].Y, path0[index0].Z))
            globalIndex += 1
            index0 += 1
            for i in range(index0, len(path0)):
                if (path0[i].Z == points0[0].Z):
                    points0.append(rs.CreatePoint(path0[i].X, path0[i].Y, path0[i].Z))
                    index0 += 1
                    globalIndex += 1
                else:
                    break
            points0.append(points0[0])
            curve0 = rs.AddPolyline(points0)
            rs.CloseCurve(curve0)
            curves.append(curve0)
        
        #create curve with path1 layer
        points1 = []
        if index1 < len(path1):
            points1.append(rs.CreatePoint(path1[index1].X, path1[index1].Y, path1[index1].Z))
            index1 += 1
            globalIndex += 1
            for i in range(index1, len(path1)):
                if (path1[i].Z == points1[0].Z):
                    points1.append(rs.CreatePoint(path1[i].X, path1[i].Y, path1[i].Z))
                    index1 += 1
                    globalIndex += 1
                else:
                    break
            points1.append(points1[0])
            curve1 = rs.AddPolyline(points1)
            rs.CloseCurve(curve1)
            curves.append(curve1)
        
        # subtract curve1 from curve0 if curve1 exists
        if len(curves) >= 2:
            newCurve = rs.CurveBooleanDifference(curves[0], curves[1])
        else:
            newCurve.append(curve0)
        
        #if the subtract worked generate the points for it and add to final path
        if len(newCurve) == 1:
            points = rs.CurvePoints(newCurve)
            for i in range(0, len(points)-1):
                path.append(rs.CreatePoint(points[i].X, points[i].Y, points[i].Z))
        #else add the points of path0 to the final path
        else:
            print("hello?")
            for i in range(0, len(points0)):
                path.append(rs.CreatePoint(points0[i].X, points0[i].Y, points0[i].Z))

            '''for i in range(0, len(points1)):
                path.append(rs.CreatePoint(points1[i].X, points1[i].Y, points1[i].Z))'''

