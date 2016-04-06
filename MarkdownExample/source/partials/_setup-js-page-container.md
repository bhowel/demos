#### Page container

Add `pageContainer` to your global variable section:

```javascript
var pageContainer = "nameOfHTMLTag";
```

This variable points to the the HTML tag that contains your lists.
You can use `<body>` or a `<div>` for the page container.
To use `<body>`, type:

```javascript
var pageContainer = "body";
```

To use a `<div>`, add a `<div>` with an `id` to your `.html` page.
For example:

```html
<div id="divLists">
  <!-- This is where all the lists go. //-->  
</div>
```
		  
Use `#div_id` as the value of `pageContainer`. For example, if the `id` is `divLists`, type:

```javascript
var pageContainer = "#divLists";
```