# Documentation

In the scripting environment, users can configure their clay 3D printer and define their object shape. 

## Clay 3D Printer Configuration

The following configuration is for the [Potterbot](https://3dpotter.com/) clay 3D printer.

`potterbot_printSpeed`: Example - 30

`potterbot_nozzleDiameter`: Example - 5.0

`potterbot_layerHeight`: Example - 1.8

`potterbot_extrusionMultiplier`: Example - 1.0

`potterbot_bedSize`: Example - [280, 265, 305]

## Key Functions

CoilCAM functions span different functions and operations:

- 1D functions: exponential, linear, sinusoidal, square, and staircase
- 2D functions: linear and sinusoidal
- Boolean Operations: difference, intersection, and union
- Setup: base, center print, GCode generation, printer presets, spiralize, and tool pather generation

### 1D Functions

### 2D Functions

`toolpathUnitGenerator`: Generates a toolpath for a 3D form based on the provided initialization and shaping parameters. Example shape making functions include: exponential, linear, sinusoidal, square, and staircase.

**Parameters**

- `Position` (`point3D`): The (x, y, z) coordinates of the form's center.

- `Initial radius` (`float`): The radius of the base form.
  
- `nbLayers` (`int`): The number of layers in the form.

- `nbPointsInLayer` (`int`): The number of points per layer.

**Shaping Parameters (optional)**

- `radiusShapingParameter` (`float`): Applies a 1D function to points in a layer, modifying the layer's perimeter.

- `scaleShapingParameter` (`float`): Applies a 1D function to the scale of all layers, modifying the profile of the form.

- `scalingRadiusParameter` (`float`): Also known as scalingRadius, applies a 1D function to each layer, scaling the radius of the given layer with respect to its layer index. This creates the effect of varied strengths of radius shaping along the profile of the form.

- `translateShapingParameter` (`float`): Applies a 2D function to the position of all layers, modifying the layer offsets in the xy plane.

- `rotateShapingParameter` (`float`): Applies a 1D function to the rotation of all layers, modifying the angle of the layer.

**Returns**

- Path (point3d[]): An ordered array of points representing the generated toolpath

### Boolean Operations

### Setup