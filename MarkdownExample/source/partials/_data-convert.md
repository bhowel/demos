<a name="Converting-your-data"></a>
### Converting your data

Complete instructions on converting different data sources is beyond the scope of this guide.
However, we can give you a simple example that might point you in the right direction.

Let's assume you're running a web service that returns a JSON result, but it's not in the format
you need for TuffDataList. You probably have a function that provides the response, such as:

```javascript
function returnData( response ) { 
  // Handle the response.
}//returnData
```	  

Sometimes the part of the data you want is nested inside the response:

```javascript
var response =
{ 
  "lists": {
    "employees":
    [
      { 
        "pkey"       :1, 
        "fkey"       :3, 
        "name"       :"Last, First", 
        "role"       :"Developer", 
        "dateStarted":"1/1/2015", 
        "salary"     :"80,000"
      },
      // ...other entries,
    ],
    // ...other entries,
  }, 
  // ...other entries,
}
```

You might have to display the response in the web console or use the browser developer
tools to explore the structure:

```javascript
console.log( response );

// or, to show the structure of a JSON response:

console.log( JSON.stringify( response );
```

After you understand the structure, put the data you want into a variable.
For example:

```javascript
function returnData( response ) { 
  var responseData = response.lists.employees;
}//returnData
```	 

Use an iterative function, such as a `for` loop, to go through each element
in the response. Capture each element, then map the values from the element to 
an array in the TuffDataList format. For example, if the response is:

```javascript
var response =
{ 
  "lists": {
    "employees":
    [
      { "id":1, "parent":3, "fullName":"Last, First" },
      // ...other entries,
    ],
    // ...other entries,
  }, 
  // ...other entries,
}
```

You can map the values like this:       

```javascript
function returnData( response ) {
  // Convert the response to the TuffDataList format.
  var listData     = []; // TuffDataList array.
  var responseData = response.lists.employees;
  var length       = responseData.length;
  var entry        = null;

  for ( var i = 0; i < length; i++ ) {
    entry = responseData[i];
    var listElement = { 
      "pkey":entry.id, 
      "fkey":entry.parent,  
      "name":entry.fullName }
    listData.push( listElement );	    
  }
	
  // Send listData to TuffDataList.
  // (We'll show this to you in a later step.)	
}//returnData
```	

