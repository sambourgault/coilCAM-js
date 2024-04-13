
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
import Rhino.Geometry as rg
import Rhino.DocObjects as rd
import scriptcontext as sc

path = []
stops = []
stopPoints = []
fillet = []

index0 = 0
index1 = 0
globalIndex = 0


#if len(path0) < len(path1):
    #tempPath0 = path0
   #path0 = path1
   # path1 = tempPath0
   # print(path0)
   # print(path1)

if len(path0) != 0:
    #currentHeight = path0[0].Z if path0[0].Z <= path1[0].Z else path1[0].Z
    #print(currentHeight)
    currentHeight = path0[0].Z
    
    while (index0 < len(path0) or index1 < len(path1)):
        
        curves = []
        
        # manage first path
        points0 = []
        if index0 < len(path0):
            currentHeight = path0[index0].Z
            points0.append(rs.CreatePoint(path0[index0].X, path0[index0].Y, path0[index0].Z))
            globalIndex += 1
            index0 += 1
            
            # add the points of same height to one array
            for i in range(index0, len(path0)):
                if (path0[i].Z == points0[0].Z):
                    points0.append(rs.CreatePoint(path0[i].X, path0[i].Y, path0[i].Z))
                    index0 += 1
                    globalIndex += 1
                else:
                    break
            # close the curve by adding the first point to the end of the array and add curve0 to curves
            points0.append(points0[0])
            curve0 = rs.AddPolyline(points0)
            rs.CloseCurve(curve0)
            curves.append(curve0)
        
        #manage second path
        points1 = []
        if index1 < len(path1) and path1[index1].Z == currentHeight:
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
        
        #if two curves try boolean
        if len(curves) >= 2:
            a = rs.CurveBooleanUnion(curves)
            
            if (len(a) == 1):
                rs.coercecurve(a)
                b = rg.Curve.CreateFilletCornersCurve(rs.coercecurve(a), radius, tolerance, 0.0)
                fillet.append(b)
                newCurve = sc.doc.Objects.AddCurve(b)
                points = rs.CurvePoints(newCurve)
                for i in range(0, len(points)-1):
                    path.append(rs.CreatePoint(points[i].X, points[i].Y, points[i].Z))
            else:
                for i in range(0, len(points0)):
                    path.append(rs.CreatePoint(points0[i].X, points0[i].Y, points0[i].Z))
                    
                stops.append(len(path)-1)
                stopPoints.append(path[len(path)-1])
            
                for i in range(0, len(points1)):
                    path.append(rs.CreatePoint(points1[i].X, points1[i].Y, points1[i].Z))
                
                stops.append(len(path)-1)
                stopPoints.append(path[len(path)-1])
        else:
            if index0 < len(path0):
                for i in range(0, len(points0)):
                    path.append(rs.CreatePoint(points0[i].X, points0[i].Y, points0[i].Z))
            elif index1 < len(path1):
                for i in range(0, len(points1)):
                    path.append(rs.CreatePoint(points1[i].X, points1[i].Y, points1[i].Z))

