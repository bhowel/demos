<a name="Set-up-your-HTML-page"></a>
### Set up your HTML page

You can use TuffDataList in any page.

#### Add the stylesheet links

Open the `.html` file for your page in a text editor
and add the following stylesheet links inside the `<head>` tag:

```html
<link href="tuffDataList/css/vendor/jquery-ui.css" rel="stylesheet" type="text/css" />  
<link href="tuffDataList/css/tuffDataList.css" rel="stylesheet" type="text/css" />
```

<span class="fontawesome-pushpin"></span> The `href` for each stylesheet contains the path to the stylesheets.
Our example shows the paths to use if both your `.html` file and the `tuffDataList` folder are
inside the top-level folder.
If you're using different locations, change the paths to match.

#### Add the script tags

#####Add jQuery

TuffDataList requires jQuery 1.9.x or above at the page level. If you don't have a current version, you can download it from
<a href="http://jquery.com/download/#jquery-1-x" target="_blank">jQuery 1.x</a>. Put the file somewhere under your top-level folder,
then add a Javascript tag inside the `<head>` tag or wherever you place your Javascript:

```html
<script src="pathToFile/jqueryFile.js"></script>
```

| Parameter       | Description |
|----------       |-------------|
| `pathToFile`    | The local path to your jQuery file. |
| `jqueryFile.js` | The name of the jQuery file. |

For example:

```html
<script src="js/vendor/jquery-1.11.3.min.js"></script>
```

#####Add the TuffDataList Javascript

Add the following Javascript tags inside the `<head>` tag or wherever you like to place your Javascript:

```html
<script src="tuffDataList/js/vendor/jquery-ui-1.11.0.min.js"></script>
<script src="tuffDataList/tuffDataList.js"></script> 
```

<span class="fontawesome-pushpin"></span> Remember, if you're using different locations, change the paths to match.