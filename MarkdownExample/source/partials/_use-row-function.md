In this section, we'll show you how to use the `buildList` function
with the `selectedRowFunction` parameter.
When the user selects a list row, `selectedRowFunction` performs a custom action.

For this example, the `listContainers` variable is:

```javascript
var listContainers = [
  { 
    name: "Employees",
    top: 120, left: 410, width: 380,
    color: "#dddddd",
    source: "", target: ""
  }		
];
```

And the list data from the web service is:

```javascript
var employees =
[
  { 
    "pkey"       :1, 
    "fkey"       :"", 
    "name"       :"Last, First", 
    "role"       :"VP Engineering", 
    "dateStarted":"1/1/2015", 
    "salary"     :"100,000"
  },
  { 
    "pkey"       :2, 
    "fkey"       :"", 
    "name"       :"Last, First", 
    "role"       :"Developer", 
    "dateStarted":"1/1/2015", 
    "salary"     :"80,000" 
  }	
]       
```

You want to use `buildList` to create a list from a web service response
and run the `handleRowSelection` function when the user selects a row in the list.

Set up the `getData` and `returnData` functions:

```javascript
function getData( selectedPkey, containerIndex ) {
  // Set the index for the current container.
  n_tuffDataList.setContainerIndex( containerIndex );
	
  // Request the web service.
  callWebService( containerIndex, selectedPkey, returnData  );
}//getData

function returnData( response ) {
  // Build a list from the returned data.
  // In this example, the response is already in TuffDataList format.
  n_tuffDataList.buildList( response, null, null );
}//
```

Add a selected row function with two parameters:

```javascript
function handleRowSelection( containerIndex, rowValues ) { 
  // Do something with the selected list container and row data.
}//handleRowSelection
```

| Parameter        | Description |
|----------        |-------------|
| `containerIndex` | The index of the selected container in `listContainers`. You can use any name for this parameter. |
| `rowValues`      | A Javascript object containing the values of the selected row. You can use any name for this parameter. |

Go back to `returnData`. Use `handleRowSelection` (without the parentheses) for the last parameter of `buildList`:

```javascript
function returnData( response ) {
	// Build a list from the returned data.
	// In this example, the response is already in TuffDataList format.
	n_tuffDataList.buildList( response, null, handleRowSelection );
}//returnData
```

Now you can call `getData`. Set `selectedPkey` to `null` and `containerIndex` to `0`, the **Employees** container.
In this example, the web service doesn't use a selected `pkey`:

```javascript
getData( null, 0 );
```

The screen result is:    
<img src="/images/custom_3.png" />

If the user selects the second row, TuffDataList calls `handleRowSelection` with `containerIndex` set to `0` (**Employees**)
and `rowValues` set to:

```javascript
{ 
  "pkey"       :2, 
  "fkey"       :"", 
  "name"       :"Last, First", 
  "role"       :"Developer", 
  "dateStarted":"1/1/2015", 
  "salary"     :"80,000" 
}
```

You can write your selected row function to do anything you like. TuffDataList provides `containerIndex` and `rowValues`
in case you want to work with the values from the selected container or row. For example:

```javascript
function handleRowSelection( containerIndex, rowValues ) {
  // Use containerIndex to show the container name.
  var containerName = listContainers[containerIndex].name; 
  console.log( ( "You selected a row in " + containerName + "."  );
	
  // Use rowValues to calculate the cost of living raise for the selected employee.
  var empName = rowValues.name;
  var raise   = calcRaise( rowValues.pkey, 
                           rowValues.role, 
                           rowValues.dateStarted, 
                           rowValues.salary );
  console.log( ( "The raise for " + empName + " is " + raise + "."  );
}//handleRowSelection
``` 