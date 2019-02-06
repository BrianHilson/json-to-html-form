# JSON to HTML Form

## Demo
https://www.hilson.io/form_builder_app/

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

- Generates all commonly used form elements.
- Generates PHP variable code for each element.
- Ability to specify form submission method (GET, POST, your custom function, etc.)
- Generates labels for each element
- Generates wrapping elements for each form element

## Example: Text Input

This:
```JSON
{
  "settings": {
    "requestMethod": "$_GET['VAR']",
    "requestMethodMany": ""
  },  
  "form": [
    {
      "element": "input",
      "type": "text",
      "name": "FULL_NAME",
      "text": "Full Name",
      "wrapper": "div.input.full",
      "noLabel": "true",
      "required": ""
    }
  ]
}
```
generates this:
```PHP
$FULL_NAME = $_GET['FULL_NAME']);
 
<div class="input full">
  <input type="text" name="FULL_NAME" value="" id="FULL_NAME" required> 
</div> 
```
Let break this down. 

## settings

### requestMethod
Determines the form submission method for PHP. This can be whatever you would like. "VAR" is replaced with the name of the form element. If empty, it defaults to "$_POST['VAR']".

### requestMethodMany
You may use a different submission method for elements with multiple values, like checkboxes. You can set that method here. If empty, it defaults to "requestMethod".

## form
Contains an array of form elements.

### element
Valid options are input, select, textarea, and button. Datalist is soon to be added.

### type
Can be anything you would like. Special handling for input radio and input checkbox.

### name
Name is used for the form element name and id, label for, and PHP variables. 

### text
Sets the label text, and the value for input checkbox, input radio, and select options.

### wrapper
Creates a wrapping element for the form element. Specify the wrapping element, followed by any classes you'd like to include, seperated by periods.

### noLabel
Specifies that this element doesn't have a label associated with it.

### Additional Properties
"required" is an additional property in this case. Any property added without special handling (element, name, text, etc.) will be simply added to the form element. If the property doesn't have an associated value, as is the case with "required", just set the value to empty ("").

## Example: Radio Input
This:
```JSON
{
  "settings": {
    "requestMethod": "$_GET['VAR']",
    "requestMethodMany": ""
  },
  "form": [
    {
      "element": "input",
      "type": "radio",
      "name": "HOGWARTS_HOUSE",
      "many": [
        {
          "id": "GRYFFINDOR",
          "text": "Gryffindor",
          "value": "Gryffindor",
          "wrapper": "div.input.quarter"
        },
        {
          "id": "RAVENCLAW",
          "text": "Ravenclaw",
          "wrapper": "div.input.quarter",
          "checked": ""
        },
        {
          "id": "SLYTHERIN",
          "text": "Slytherin",
          "wrapper": "div.input.quarter"
        },
        {
          "id": "HUFFLEPUFF",
          "text": "Hufflepuff",
          "wrapper": "div.input.quarter"
        }
      ]
    }
  ]
}
```
Generates this:
```PHP
$HOGWARTS_HOUSE = $_GET['HOGWARTS_HOUSE']);
 
<div class="input quarter">
  <label for="GRYFFINDOR">Gryffindor</label>
  <input type="radio" name="HOGWARTS_HOUSE" value="Gryffindor" id="GRYFFINDOR"> 
</div> 
<div class="input quarter">
  <label for="RAVENCLAW">Ravenclaw</label>
  <input type="radio" name="HOGWARTS_HOUSE" value="Ravenclaw" id="RAVENCLAW" checked> 
</div> 
<div class="input quarter">
  <label for="SLYTHERIN">Slytherin</label>
  <input type="radio" name="HOGWARTS_HOUSE" value="Slytherin" id="SLYTHERIN"> 
</div> 
<div class="input quarter">
  <label for="HUFFLEPUFF">Hufflepuff</label>
  <input type="radio" name="HOGWARTS_HOUSE" value="Hufflepuff" id="HUFFLEPUFF"> 
</div> 
```
