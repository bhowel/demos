In this section, we'll show you how to get multiple lists from a web service.

We'll also show you how to use the `getContainerIndex` function
to control what happens when the user selects a list row.
The `getContainerIndex` function gets the index of the current container from TuffDataList.

For this example, the `listContainers` variable is:

```javascript
var listContainers = [
  { 
    name: "Products",
    top: 120, left: 20, width: 20,
    color: "#dddddd",
    source: "", target: ""
  },
  { 
    name: "Services",
    top: 120, left: 410, width: 380,
    color: "#bbbbbb",
    source: "", target: "2"
  },
  { 
    name: "Service details",
    top: 360, left: 410, width: 380,
    color: "#bbbbbb",
    source: "1", target: ""
  }		
];
```

And the list data from the web service is:

```javascript
var products =
  [
    { "pkey":1, "fkey":"", "name":"Outdoor pot", "size":"11 in" },
    { "pkey":2, "fkey":"", "name":"Outdoor pot", "size":"6 in" },
    { "pkey":3, "fkey":"", "name":"Indoor pot", "size":"9 in" },
    { "pkey":4, "fkey":"", "name":"Indoor pot", "size":"5 in" }
  ]

var services =
  [
    { "pkey":1, "fkey":"", "name":"Garden prep" },
    { "pkey":2, "fkey":"", "name":"Complete garden installation" },
    { "pkey":3, "fkey":"", "name":"Consultation" }
  ]

var serviceDetailsPrep =
  [
    { 
      "pkey" :1, 
      "fkey" :"1",
      "fname": "Garden prep",
      "name" :"Design",
      "price":"50/hour" 
    },
    { 
      "pkey" :2, 
      "fkey" :"1", 
      "fname": "Garden prep", 
      "name" :"Prep",
      "price":"60/hour" 
    }
  ]
  
...other detail lists          
```

In this page, you want to show the **Products** and **Services** lists right away:    
<img src="/images/custom_6.png" />    
When the user selects a service, you want to show a detail list:    
<img src="/images/custom_7.png" />    
To show **Products** and **Services** right away, you have to run the web service twice. 
To keep track of the lists you get from the web service,
create an array with a separate index in your global variable section:

```javascript
  var initialServices     = [ 0, 1 ];
  var initialServiceIndex = 0;
```

You'll also need a flag to indicate when you're done with initial services:

```javascript
var initialServicesDone = false;
```
	  
When the application first starts, initialize TuffDataList and specify an onload function, `getFirstList`:

```javascript
function startPage() {
  n_tuffDataList.setupLists( pageContainer, listContainers, getFirstList );
}//startPage
```

The `getFirstList` function calls `getData` to load **Products**:

```javascript
function getFirstList() {
  getData( null, 0 );
}//getFirstList
```	  
	  
The `getData` function sets the `containerIndex` and calls the web service:

```javascript 
function getData( selectedPkey, containerIndex ) {	    
  // Set the index for the current container.
  n_tuffDataList.setContainerIndex( containerIndex );

  // Request the web service.
  // Send returnData as the callback.
  callWebService( containerIndex, selectedPkey, returnData  );
}//getData
```

When the web service gets a response, it calls `returnData`.
There's a couple of new actions in `returnData`:

* Use `getContainerIndex` to find out which list is current, then set the parameters for `buildList` to match.
* Keep track of the initial services. If they're not done, get the next list.

```javascript
function returnData( response ) {
  // Set the callbacks. 		
  var containerIndex     = n_tuffDataList.getContainerIndex().toString();
  var getDataFunction    = null;
  var handleRowSelection = null;
  switch( containerIndex ) {
	
    case "0": 
      getDataFunction    = null;
      handleRowSelection = handleSelectedProduct; 
    break;

    case "1": 
      getDataFunction    = getData;
      handleRowSelection = null; 
    break;
						
    case "2": 
      getDataFunction    = null;
      handleRowSelection = null; 
    break;
		
    default : break;
  }//switch( containerIndex )			
	
  // Build a list from the returned data.
  n_tuffDataList.buildList( response, getDataFunction, handleRowSelection );
	
  // Increment the index for initial services.
  // If we're still running initial services, send the next one.
  if ( !initialServicesDone ) {
    initialServiceIndex++;
    if ( initialServiceIndex < initialServices.length ) {
      getData( null, initialServiceIndex );
    } else {
      // Set the flag to indicate we're now done with the initial services.
      // To refresh the associated lists, reset initialServicesDone to false,
      // set initialServiceIndex to 0, then call getFirstList() again.
      initialServicesDone = true;
    }//initialServiceIndex not lt initialServices.length			
  }//initialServicesDone not true	
}//returnData
```

Let's look at the details for each of these new actions.

### getContainerIndex

You can use `getContainerIndex` to find out which list you'll dealing with
and control what happens next:

* If **Products** (`0`) is current, specify a row selection function and tell TuffDataList you don't want to retrieve a target list.    
* If **Services** (`1`) is current, tell TuffDataList you want to retrieve a target list.    
* If **Service details** (`2`) is current, tell TuffDataList you don't want either function.  

### Initial services

The final code in `returnData` keeps track of the initial services.

1. When the user first gets to your page, `initialServiceIndex` and `containerIndex` are both `0`, and your application loads **Products**:    
<img src="/images/custom_13.png" />    
2. At the end of `returnData`, the function increments `initialServiceIndex` to `1`.     
3. The `initialServiceIndex` is still less than the length of the `initialServices` array, so your application loads **Services**:    
<img src="/images/custom_14.png" />    
4. The next time through, the index is equal to the length of the array. The function sets `initialServicesDone` to true and doesn't run `getData` again.

Later, if the user selects a row in **Services**, TuffDataList calls `getData` with the `pkey` of
the selected service and the `containerIndex` for **Service details**.
When `returnData` runs, it creates the **Service details** list:    
<img src="/images/custom_15.png" />    
Because `initialServicesDone` is now true,
your application doesn't have to check or run the initial services code. 


