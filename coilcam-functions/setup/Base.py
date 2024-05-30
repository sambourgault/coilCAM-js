"""Provides a scripting component.
    Inputs:
        x: The x script variable
        y: The y script variable
    Output:
        a: The a output variable"""

__author__ = "sami_"
__version__ = "2022.08.08"

import rhinoscriptsyntax as rs
import math
import Rhino
from System import *
from Rhino import *
from Rhino.DocObjects import *
from Rhino.Geometry import *
from Rhino.Input import *
from Rhino.Input.Custom import *
from Rhino.Commands import *
from scriptcontext import doc

path = []
curves = []
contour = []
#p0 = rs.CurveStartPoint(curve)
#radius = p0.X
currentHeight = position.Z

#vectors = []
for j in range(0, nbLayers):
    contour = []
    if j != 1:
        for i in range(0, nbPoints):
            angle = 360/nbPoints
            #print(scaleFunction[j])
            #path.append(rs.CreatePoint(position.X+(radius+scaleFunction[j]+radiusFunction[i])*math.cos(i*angle*math.pi/180 + rotateFunction[j]*math.pi/180)+translateFunction[j].X, position.Y+(radius + scaleFunction[j] + +radiusFunction[i])*math.sin(i*angle*math.pi/180+rotateFunction[j]*math.pi/180)+translateFunction[j].Y, position.Z+layerHeight*j)) #*layerHeight/nbPoints
            path.append(rs.CreatePoint(position.X+radius*math.cos(i*angle*math.pi/180), position.Y+radius*math.sin(i*angle*math.pi/180), position.Z+layerHeight*j)) #*layerHeight/nbPoints
            contour.append(rs.CreatePoint(path[len(path) - 1].X-position.X, path[len(path) - 1].Y-position.Y, 0))
            #contour.append(path[len(path) - 1])
            #vectors.append(rs.VectorUnitize(rs.VectorCreate(rs.CreatePoint(0,0,0), rs.CreatePoint(math.cos(i*angle*math.pi/180), math.sin(i*angle*math.pi/180), 0))))
        path.append(path[len(path) - nbPoints] )
        contour.append(rs.CreatePoint(path[len(path) - 1].X-position.X, path[len(path) - 1].Y-position.Y, 0))
        #contour.append(path[len(path) - 1])
    
    if j % 2 == 0:
        a = rs.AddPolyline(contour)
        centroid = rs.CurveAreaCentroid(a)
        centroid = centroid[0]
        #centroid = position
        print(centroid)
        c = rs.CurveClosestPoint(a, centroid)
        point = rs.EvaluateCurve(a, c)
        g = rs.VectorAdd(point, -centroid)
        print(g)
        #center = rs.CreatePoint(centroid.X, centroid.Y, 0)
        d = rs.VectorLength(g)
        div = d / thickness
        srf = rs.AddPlanarSrf([a])
        plane = rs.CurvePlane(a)
        crv= rs.coercecurve(a)
        St = Rhino.Geometry.CurveOffsetCornerStyle.Sharp
        center = rs.AddPoint(position.X,position.Y,0)
        
        for i in range(1,int(div)):
            #series.append(i*thickness)
            #print(i*thickness)
            #print(centroid)
            #print(rs.CurvePoints(a)[0])
            #print(i)
            #curveOff = rs.OffsetCurve(a,center,-0.001, normal=None, style=1)
            scaleRatio = (radius - i*thickness)/radius
            """curve0 = rs.ScaleObject(a, center, (scaleRatio, scaleRatio, 0), True)
            curve = rs.MoveObject(curve0, rs.AddPoint(0,0,currentHeight))"""
            #b = rs.AddCurve(a)
            #curve = rs.coercecurve(b)
            #curve[0].Scale(i*thickness/radius)
            #print()
            curve = crv.Offset(plane, -0.001, 0.01, St)
            
            curve[0].Scale(scaleRatio)
            curve[0].Translate(position.X,position.Y,currentHeight)
            #curve = crv.OffsetOnSurface(rs.coercesurface(srf), i*thickness, 100)
            #print(curve)
            #print(len(curve))
            #ccurve = rs.AddCurve(curve[0])
            curves.append(curve[0])
            #for p in rs.CurvePoints(ccurve):
            if curve != None:
                #for p in rs.CurvePoints(curve):
                for p in range(0, nbPoints):
                    path.append(curve[0].PointAt(p))
            else:
                #print(-i*thickness)
                print()
    else:
        pp1 = rs.CreatePoint(path[0].X - position.X, path[0].Y-position.X, path[0].Z)
        pp2 = rs.CreatePoint(path[0].X-2*radius - position.X, path[0].Y-position.X, path[0].Z)
        srf = rs.AddPlanarSrf([a])
        geo = rs.coercegeometry(srf)
        path2 = []
        contours = Brep.CreateContourCurves(geo, pp1, pp2, thickness)
        switch = True
        for cc in contours:
            start = cc.PointAtNormalizedLength(0)
            end = cc.PointAtNormalizedLength(1)
            if switch:
                path.append(rs.CreatePoint(start.X + position.X, start.Y + position.Y, start.Z + currentHeight))
                path.append(rs.CreatePoint(end.X + position.X, end.Y + position.Y, end.Z + currentHeight))
                switch = False
            else:
                path.append(rs.CreatePoint(end.X+ position.X, end.Y+ position.Y, end.Z + currentHeight))
                path.append(rs.CreatePoint(start.X+ position.X, start.Y+ position.Y, start.Z + currentHeight))
                switch = True
    currentHeight += layerHeight