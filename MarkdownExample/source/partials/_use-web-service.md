In this section we'll show you how to use the `setContainerIndex` and `buildList` functions
to create a basic list from a web service.

For this example, the `listContainers` variable is:

```javascript
var listContainers = [
  { 
    name: "Departments",
    top: 120, left: 20, width: 380,
    color: "#dddddd",
    sourceList: "", targetList: ""
  }	
];
```

And the list data from the web service is:

```javascript
var departmentList =
[
  { "pkey":1, "fkey":"", "name":"Customer Service" },
  { "pkey":2, "fkey":"", "name":"Human Relations" },
  { "pkey":3, "fkey":"", "name":"Engineering" },
  { "pkey":4, "fkey":"", "name":"Sales" }
]      
```

The page has two functions for handling the web service:

* `getData` calls the web service.    
* `returnData` is used by the web service to return the data to the page.

To make these functions work with TuffDataList, put `setContainerIndex` in `getData` and `buildList` in `returnData`:

```javascript
function getData( selectedPkey, containerIndex ) {
  // Set the index for the current container.
  n_tuffDataList.setContainerIndex( containerIndex );
	
  // Request the web service (not defined here), which retrieves the list by its name.
  // To tell the web service what to do after it gets the data,
  // we'll send returnData as a callback parameter.
  callWebService( containerIndex, selectedPkey, returnData  );
}//getData

function returnData( response ) {
  // Build a list from the returned data.
  // In this example, the response is already in TuffDataList format.
  n_tuffDataList.buildList( response, null, null );
}//returnData
```

Now you can call `getData`. Set `selectedPkey` to `null` and `containerIndex` to `0`, the **Departments** container.
In this example, the web service doesn't use a selected `pkey`:

```javascript
getData( null, 0 );
```

The screen result is:    
<img src="/images/custom_4.png" />