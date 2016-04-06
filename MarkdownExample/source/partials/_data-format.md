<a name="Data-format"></a>
### Data format

The format for each list is an array of JSON objects:

```javascript
var arrayName =
[
  { 
    "pkey"      :"primaryKeyValue", 
    "fkey"      :"foreignKeyValue", 
    "columnName":"columnValue",
    // ...other columns,
    // ...last column, with no comma 
  },
  { 
    // ...other rows 
  },
  { 
    // ...last row, with no comma 
  }
]
```

For example:

```javascript
var engineeringEmployees =
[
  { 
    "pkey"       :1, 
    "fkey"       :3, 
    "name"       :"Last, First", 
    "role"       :"Developer", 
    "dateStarted":"1/1/2015", 
    "salary"     :"80,000"
  }
]
```

The JSON objects contain name/value properties. Each property has a name followed by the property's value.
When you're writing JSON, enclose the name in double quotes:

```javascript
"role":"Developer" // The name is "role"
```

Enclose each value in double quotes unless the value is numeric:

```javascript
"pkey":1           // Numeric value
"role":"Developer" // Non-numeric value
```

<span class="fontawesome-info-sign"></span> To find out more about JSON formats, **see**
<a href="https://en.wikipedia.org/wiki/JSON" target="_blank">Wikipedia: JSON</a>,

The following table defines each parameter. We'll give you more details in the next few sections. 

| Parameter         | Description |
|----------         |-------------|
| `arrayName`       | The name of the array. For example, `engineeringEmployees`. This is the element you send to TuffDataList when you create a list. |
| `"pkey"`          | The name of the primary key, which identifies the row. You must use the name `"pkey"`. |
| `primaryKeyValue` | The value of the <a href="http://www.w3schools.com/sql/sql_primarykey.asp" target="_blank">primary key</a>. For example, `1` or `"a_001"`. |
| `"fkey"`          | The name of the <a href="http://www.w3schools.com/sql/sql_foreignkey.asp" target="_blank">foreign key</a>, which identifies the row in the source list. You must use the name `"fkey"`. |
| `foreignKeyValue` | The value of the foreign key. For example, `1` or `"a_001"`. |
| `columnName`      | The name of a column. For example, `"role"`. |
| `columnValue`     | The value of a column. For example, `"Developer"`. |