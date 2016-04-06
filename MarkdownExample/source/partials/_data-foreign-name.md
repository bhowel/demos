<a name="Foreign-name"></a>
### Foreign name

When TuffDataList loads a target list, it puts the source's `pkey` into an input field at the top
of the target:    
<img src="/images/custom_9.png" />  

The key isn't helpful because it doesn't appear in the source list.
The user can't tell which source row is related to the target.

To create a better label, add the optional `fname` to the target data:

```javascript
var serviceDetailsConsult =
  [
    { 
      "pkey" :1, 
      "fkey" :"3", 
      "fname":"Consultation", 
      "name" :"Survey",
      "price":"40/hour" },
    { 
      "pkey" :2, 
      "fkey" :"3", 
      "fname":"Consultation", 
      "name" :"Recommendations", 
      "price":"30/hour" }
  ]
```

When you add the `fname`, TuffDataList uses it at the top of the target instead of the key:    
<img src="/images/custom_8.png" />    
Now it's easy for the user to see where the data came from:    
<img src="/images/custom_10.png" />    

