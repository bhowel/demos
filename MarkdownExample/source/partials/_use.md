To use TuffDataList to create a list from your data, use the `setContainerIndex` and `buildList` functions:

```javascript
n_tuffDataList.setContainerIndex( containerIndex );
n_tuffDataList.buildList( listData, getDataFunction, selectedRowFunction );
```

The `setContainerIndex` function sets the index of the list container in TuffDataList so it
can populate the correct container when you call `buildList`, the function that actually creates the list.

The parameters are:

| Parameter             | Description |
|----------             |-------------|
| `containerIndex`      | The index of the container you want to use from `listContainers`. |
| `listData`            | The list data in TuffDataList [format](../../toc-0/data/). To learn how to use `listData` with a web service, **see** [Creating a list from a web service](../../toc-1/use-web-service/). |
| `getDataFunction`     | The name of a function that retrieves the target list for a selected row. To learn how to use this parameter, **see** [Adding a selected row function](../../toc-1/use-selected-row/). |
| `selectedRowFunction` | The name of a function that performs an action when the user selects a row. To learn how to use this parameter, **see** [Adding a get data function](../../toc-1/use-get-data/). |

In this section, we'll show you how to use `setContainerIndex` and how the `listData` parameter works for a basic list.
The next sections will cover the other parameters and show you how to use the `buildList` function from a web service.

We'll start with a simple example. Let's say you have a price list you want to show in a page. Your `listContainers` variable is:

```javascript
var listContainers = [
  { 
    name: "Prices",
    top: 120, left: 20, width: 380,
    color: "#dddddd",
    source: "", target: ""
  }		
];
```

And you have a static price list set up in TuffDataList format:

```javascript
var priceList =
[
  { 
    "pkey" :"p_001", 
    "fkey" :"", 
    "name" :"Product 1", 
    "price":"10.00"
  },
  {   
    "pkey" :"p_002", 
    "fkey" :"", 
    "name" :"Product 2", 
    "price":"15.00"
  },
  {   
    "pkey" :"p_003", 
    "fkey" :"", 
    "name" :"Product 3", 
    "price":"5.00"
  }		
]
```

You want to create a basic list - a list without additional functionality.
First, use the `setContainerIndex` function with `containerIndex` set to `0`, the index of the container in `listContainers`:

```javascript
n_tuffDataList.setContainerIndex( 0 );
```
 
Next, use the `buildList` function. Set the `listData` parameter to the variable that contains your list data, then set the other parameters to null:

```javascript
n_tuffDataList.buildList( priceList, null, null );
``` 

After you call `buildList`, your list looks like this on the screen:    
<img src="/images/custom_5.png" /> 

If you have more than one list, it's easy to handle all of them. For example, your `listContainers` variable is:

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
    source: "", target: ""
  }	
];
```

And your lists are:

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
```	

To create the lists, use the following commands:

```javascript
// Build the product list.
n_tuffDataList.setContainerIndex( 0 );
n_tuffDataList.buildList( products, null, null );

// Build the service list.
n_tuffDataList.setContainerIndex( 1 );
n_tuffDataList.buildList( services, null, null );

``` 