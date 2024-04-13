"""Provides a scripting component.
    Inputs:
        x: The x script variable
        y: The y script variable
    Output:
        a: The a output variable"""

__author__ = "sami_"
__version__ = "2022.07.05"

import rhinoscriptsyntax as rs
import math

"""points= []
for j in range(0, int(len(path)/nbPoints)):
    for i in range(0, nbPoints):
        points.append(rs.CreatePoint(path[i+j*nbPoints].X, path[i+j*nbPoints].Y, path[i+j*nbPoints].Z + i*layerHeight/nbPoints))
        """
        
#index = 0
previousHeight = path[0].Z
layerNbPoints = []
print(len(path))
for i in range(0, len(path)):
    if abs(previousHeight - path[i].Z) > 0.01:
        layerNbPoints.append(i)
        #print(i)
        previousHeight = path[i].Z

points= []
index = 0
previousLayerNbPoints = 0
previousLastIndex = 0
for j in range(0, len(layerNbPoints)):
    print(j)
    for i in range(index, layerNbPoints[j]):
        print(index)
        points.append(rs.CreatePoint(path[index].X, path[index].Y, path[index].Z + (i-previousLastIndex)*layerHeight/(layerNbPoints[j] - previousLayerNbPoints)))
        print(layerNbPoints[j] - previousLayerNbPoints)
        print(path[index].Z)
        print(points[index].Z)
        index += 1
    previousLayerNbPoints = layerNbPoints[j]
    previousLastIndex = index


"""while 0 < len(path):
    
    points.append(rs.CreatePoint(path0[index].X, path0[index].Y, path0[index].Z))
    for i in range(index, len(path)):
        if (path[i].Z == points[0].Z):
            points.append(rs.CreatePoint(path[i].X, path[i].Y, path[i].Z + i*layerHeight/nbPoints))
            index += 1
        else:
            break"""