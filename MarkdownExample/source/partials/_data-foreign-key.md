<a name="Foreign-key"></a>
### Foreign key

Each row in a source list has a primary key. When the user selects a row in a source list, TuffDataList sends 
the primary key back to your application so you can use it to retrieve the target list.

The primary key from the the source list is the foreign key of the target list.
It's the same in every row of the target list.

Let's look at an example:    
<img src="/images/custom_11.png" />    
**Departments** is a source list with empty foreign keys:

```javascript
{ "pkey":1, "fKey":"", "name":"Customer Service" },
{ "pkey":2, "fKey":"", "name":"Human Relations" },
{ "pkey":3, "fKey":"", "name":"Engineering" },
{ "pkey":5, "fKey":"", "name":"Sales" }
```

If the user selects the **Engineering** department, which has the primary key `3`,
TuffDataList populates **Employees for department** with the target list.
The target list has the foreign key `3` in every row:

```javascript
{ "pkey":1, "fKey":3, "name":"Last, First", "role":"VP Engineering", ...other columns },
{ "pkey":2, "fKey":3, "name":"Last, First", "role":"Developer", ...other columns },
{ "pkey":3, "fKey":3, "name":"Last, First", "role":"Developer", ...other columns },
{ "pkey":4, "fKey":3, "name":"Last, First", "role":"UI Developer", ...other columns },
{ "pkey":5, "fKey":3, "name":"Last, First", "role":"Guides Editor", ...other columns }
```

