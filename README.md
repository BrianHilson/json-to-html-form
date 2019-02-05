# JSON to HTML Form

## Demo
(https://www.hilson.io/form_builder_app/)

This page always has the most up to date version of the app.

## Why This Exists

Creating forms is annoying, especially when you add PHP variables into the mix. Take for example, the humble input element:
```PHP
$xFIRST_NAME = $_GET['xFIRST_NAME']);

<label for="xFIRST_NAME">First Name</label>
<input type="text" name="xFIRST_NAME" value="" id="xFIRST_NAME" required> 
```
In creating this one form element I end up typing or copy/pasting "xFIRST_NAME" five times. That's time consuming and error prone. A few small mistakes in a form can mean an hour of troubleshooting. 

I'm sure many frameworks use simpler syntax to create forms, but at my job we still make them the old fashioned way with HTML and PHP. So to make this task a little easier, I've written a web app which creates forms from JSON. This is not intended to create a fully functioning form, it only generates the PHP variables and HTML form elements. Form handling code is still left up to you. This app reduces the time consuming, error prone, and repetitive work of building a form. It gets you 80% of the way toward a functioning form, hopefully for about 20% of the effort.

## Features

-Can generate all commonly used form elements.
-Generates PHP variable code for each element.
-Ability to specify form submission method (GET, POST, your custom function, etc.)
-Can generate associate labels
-Can create wrapping elements for each form element

## Examples
This:
```JSON
{
  "form": [
    {
      "element": "input",
      "type": "text",
      "name": "xFIRST_NAME",
      "text": "First Name",
      "wrapper": "div.input.half",
      "noLabel": "true",
      "required": ""
    }
  ]
}
```
generates this:
```PHP
$xFIRST_NAME = $_GET['xFIRST_NAME']);
 
<div class="input half">
  <input type="text" name="xFIRST_NAME" value="" id="xFIRST_NAME" required placeholder="First Name"> 
</div> 
```

