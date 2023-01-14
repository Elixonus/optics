# optics 🔍

Lightweight real-time **ray optics** simulation that implements the physics phenomena of reflection and refraction.

Designed mostly for **education** and not professional use. 📚

![Wallpaper](./optics/images/wallpaper.png)

## User Interface 👌

### Input

There are three different mouse tools to interact with the lasers and mirrors. The bar on the left shows which tool is currently activated.

* **Translation tool** indicated by the move symbol, is used to translate the objects in the scene.
This option has two additional subtools to limit the movement in a certain axis.

* **Rotation tool** indicated by the spinning arrow symbol, is used to set the rotation of the objects in the scene.

* **Object tool** indicated by the cube symbol, is used to interact with the properties specific to the object you are selecting.
For lasers, this is used to toggle the emission ON and OFF. 
For mirrors, this is used to cycle the type of interference from refractive, reflective, absorbtive.
If the mirror is in refractive mode, the index of refraction can be dialed up and down an extended amount with the mouse.
For guide tools, this is used to toggle between a ruler and a protractor.

### Output

Three types of objects are displayed differently.

* **Absorbing** objects have white contour.

* **Reflecting** mirrors have red contour and zero fill.

* **Refracting** lenses have red contour and red fill *(the higher the refractive index of the lens, the more visible the filled color)*.

## Keybindings 🔑

### Tools

```T``` - Switch to translation tool.

```X``` - Switch to horizontal translation subtool *(only works when using translation tool or vertical translation subtool)*.

```Y``` - Switch to vertical translation subtool *(only works when using translation tool or horizontal translation subtool)*.

```R``` - Switch to rotation tool.

```C``` - Switch to change tool.

### Creation

```L``` - Instantiate a laser from where the mouse is located.

```I``` - Instantiate a random polygonal mirror from where the mouse is located.

```G``` - Instantiate a ruler guide tool from where the mouse is located.

### Camera

```(ARROW KEYS)``` or ```(WASD KEYS)``` - Pan the camera incrementally.

### Extra

```(DELETE)``` or ```(BACKSPACE)``` - Remove all the lasers and mirrors from the scene.

```(NUMBER KEYS)``` - Load a predefined scene in the program.

```Z``` - Toggle between quality and performance.

## Limitations 🔒

To avoid performance losses, the maximum collisions per each laser path is set to 50.
