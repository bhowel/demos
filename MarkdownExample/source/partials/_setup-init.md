When you finish the basic setup, it's time to initialize TuffDataList.

To initialize TuffDataList, add the `setupLists` function, which creates one empty container for each list.
Put the function somewhere near the beginning of your `.js` file. The location doesn't matter
as long as the function runs before any other TuffDataList functions:

```javascript
n_tuffDataList.setupLists( pageContainer, listContainers, onloadFunction );
```

The `pageContainer` and `listContainers` parameters are the variables you created earlier.
Replace `onloadFunction` with the name of a function (without the parentheses)
you want to run as soon as the lists are ready.

Use a function that doesn't have any parameters.
For example, if you want to use a `getFirstList` function:

```javascript
function getFirstList() {
  // ...
}//getFirstList
```
Then your `setupLists` function is:

```javascript
n_tuffDataList.setupLists( pageContainer, listContainers, getFirstList );
```

If you don't want an onload function, set the parameter to null:

```javascript
n_tuffDataList.setupLists( pageContainer, listContainers, null );
```