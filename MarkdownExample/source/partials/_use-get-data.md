In this section, we'll show you how to use the `buildList` function
with the `getDataFunction` parameter.
When the user selects a list row, `getDataFunction` gets a target list.

For this example, the `listContainers` variable is:

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

**Departments** (`0`) is the source container and **Employees for department** (`1`) is the target container.

The source list from the web service is:

```javascript
var departmentList =
[
  { "pkey":1, "fkey":"", "name":"Customer Service" },
  { "pkey":2, "fkey":"", "name":"Human Relations" },
  { "pkey":3, "fkey":"", "name":"Engineering" },
  { "pkey":4, "fkey":"", "name":"Sales" }
]      
```

When the user selects the **Engineering** department, the target list from the web service is:

```javascript
var engineeringEmployees =
[
  { 
    "pkey"       :1, 
    "fkey"       :3, 
    "fname"      :"Engineering", 
    "name"       :"Last, First", 
    "role"       :"VP Engineering", 
    "dateStarted":"1/1/2015", 
    "salary"     :"100,000"
  },
  { 
    "pkey"       :2, 
    "fkey"       :3,
    "fname"      :"Engineering", 
    "name"       :"Last, First", 
    "role"       :"Developer", 
    "dateStarted":"1/1/2015", 
    "salary"     :"80,000" 
  }	
]      
```

You want to use `buildList` to create **Departments** from a web service
and get **Employees for department** when the user selects a department.

Set up the `getData` and `returnData` functions.
Use `getData` (without the parentheses) for the second parameter of `buildList`:

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
	n_tuffDataList.buildList( response, getData, null );
}//
```

Now you can call `getData.` Set `selectedPkey` to `null` and `containerIndex` to `0`, the **Departments** container.
In this example, the web service doesn't use a selected `pkey` to get **Departments**:

```javascript
getData( null, 0 );
```

The screen result is:    
<img src="/images/custom_2.png" />

If the user selects the third row, **Engineering**,  TuffDataList calls `getData` with `selectedPkey` set to `3`, the `pkey` for **Engineering**,
and `containerIndex` set to `1`, the target container.

In `getData`, the `setContainerIndex` function tells TuffDataList the current list is now **Employees for department**,
so `buildList` can create the correct list. The screen result is now:      
<img src="/images/custom_12.png" />