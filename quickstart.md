## rough draft, examples to follow
Getting started
In the editor below, press the "Run" button at the upper left.
In the visualization window to the right, you should see a simple vessel appear. 

Forms are created through the ToolpathUnitGenerator function. This function accepts ten parameters.
* The first five parameters initialize the form.
    * position (array): Sets the x, y, z coordinates for the center of the form.
    * initialRadius (float): Sets the radius of the form.
    * layerHeight (float): Sets the height of all layers in the form.
    * nbLayers (int): Sets the number of layers for the form.
    * nbPointsInLayer (int): Sets the number of points in each layer.
* The last five optional parameters are used to shape the vessel.
    * radiusShapingParameter (1D array or float): Shapes the radius of each layer.
    * scaleShapingParameter (1D array or float): Shapes the profile of the form.
    * scalingRadiusShapingParameter (1D array or float): 
    * translateShapingParameter (1D array or float): Offsets the xy position of each layer in the form.
    * rotateShapingParameter (1D array or float): Rotates each layer in the form.

For this demo, a sinusoidal function was applied to the profile of the vessel using the scaleShapingParameter. Try altering the amplitude, period and offset (the first three parameters) to observe how the vessel changes shape.

# add demo here

Next, a linear function was applied to the vessel to add rotation. Try altering the amplitude and offset (the first two parameters) to observe how the vessel changes shape.

# add code here

Next, a spout was added to this vase using the union function. 
# add demo

Next, the base was added to the vessel through the base function.  The base function accepts six parameters, which are dependent on the parameters of the form it will be attached to.
* position: The x, y, z coordinates for the center of the form.
* path: The toolpath of the form.
* nbPointsInLayer: The number of points in the first layer of the form.
* layerHeight: The height of all layers in the form.
* nozzleDiameter: The thickness of the nozzle that will be used to print the toolpath.
* radius: The radius of the form.

# Preparing to print your form.

Before saving your form as a gcode file, make sure to spiralize and center the toolpath using the spiralize and centerPrint functions. This will ensure that each layer smoothly connects to the next, and that your form is properly centered on the print bed.
The spiralize function accepts one parameter.
* path: The toolpath of the form.
The centerPrint function accepts three parameters.
* path: The toolpath of the form.
* position: The x, y, z coordinates for the center of the form.
* bedDimensions: The x, y, z coordinates specifying the dimensions of the printer bed.
* layerHeight: The height of all layers in the form.

After you've applied these functions and are satisfied with your vessel, you can save your toolpath as a GCode file using the generateGCode function. The generateGCode function accepts three parameters.
* path: The toolpath of the form.
* nozzleDiameter: The thickness of the nozzle that will be used to print the toolpath.
* printSpeed: The print speed (mm/s).

You can copy the GCode string using console.log, or download the GCode string directly to your computer using the downloadGCode function.

# Common issues
While there are no limits for the kinds of vessels that can be constructed through CoilCAM, there are a few common mistakes that lead to faulty prints. 
* Each layer in the toolpath must be able to support the weight of the layers above it. Each layer of the toolpath should stay within 45 degrees of difference of the layer below it.
* Layer height should be around half of the nozzle diameter.
* Joining two vessels together through the boolean union function can cause "artifacts" in the toolpath if the two layers are not rotationally aligned. Consider changing the rotation of one or more layers if this issue affects the toolpath. 

# Other examples
To view or modify pre-existing examples, please view the vessels in the "examples" folder.

A full list of functions is available through the CoilCAM Object Documentation. 

Documentation To Do:
Add functions to the hugo site with demos, similar to hydra video synth
Add a common errors page with some issues that came up in previous prints.

