#### List containers

Add `listContainers` to your global variable section:

```javascript
var listContainers = [
  { 
    name  : "nameOfContainer",
    top   : pixelPosition, 
    left  : pixelPosition, 
    width : pixelWidth,
    color : "cssColor",
    source: "sourceIndex",
    target: "targetIndex"
  },
  { 
    //...as many containers as you want to add
  },
  { 
    //...last one, with no comma
  }		
];
```

List containers are the main ingredients of TuffDataList.
Each container is a draggable, resizable `<div>` that contains a data list:    
<img src="/images/custom_4.png" />    
The `listContainers` variable is an array of Javascript objects - one for each container you want to add.
TuffDataList uses the information in this array to set up your containers.
 
Whenever you want to do something with a container, use its index - its position in the array. The index is zero-based,
which means it starts with zero instead of one.
So, if you're working with the first container, refer to it as `0`, the second as `1`, and so on.

We'll explain each of the properties of `listContainers` in the following sections, starting with the basic properties.

##### Basic properties

| Property | Description |
|----------|-------------|
| <span style="white-space: nowrap;">`name: "nameOfContainer"`</span>      | The screen name for the container. For example, `name: "Departments"`. |
| <span style="white-space: nowrap;">`top: pixelPosition`</span>           | The vertical screen position of the container in pixels. For example, `top: 120`. |
| <span style="white-space: nowrap;">`left: pixelPosition`</span>          | The horizontal screen position of the container in pixels. For example, `left: 20`. |
| <span style="white-space: nowrap;">`width: pixel_pixelWidthwidth`</span> | The width of the container in pixels. For example, `width: 380`. TuffDataList sets the minimum width to 380 pixels, and you can set a greater width. |
| <span style="white-space: nowrap;">`color: "cssColor"`</span>            | The color of the container. You can use any valid CSS color, such as `#cccccc`, `rgba( 17, 17, 17, 1.0 )`, or `black`. For example, `color: "#dddddd"`. |
	    

##### Source/target

You can set up any container as a source list or as a target list.
When the user selects a row in a source, TuffDataList loads its target with the related list.

To indicate a source, use the index of the target in `target`.
To indicate a target, use the index of the source in `source`.

In the following example, **Departments** (`0`), is a source and its target is
**Employees for department** (`1`):

```javascript
var listContainers = [
  { 
    name: "Departments",
    top: 120, left: 20, width: 380,
    color: "#dddddd",
    source: "", target: "1"
  },
  { 
    name: "Employees for department",
    top: 120, left: 410, width: 380,
    color: "#bbbbbb",
    source: "0", target: ""
  }		
]; 
```		

When the user goes to the page, **Departments** contains a list and **Employees for department** is empty:    
<img src="/images/custom_2.png" />    
If the user selects the **Engineering** row, TuffDataList populates **Employees for department** with **Engineering** employees:    
<img src="/images/custom_11.png" />    