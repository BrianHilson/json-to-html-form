# JSON to HTML Form

## Working example
https://www.hilson.io/examples/json-to-html-form/

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

## To Do

- Add handling for datalist elements

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

### echoValues
Adds php which echoes values from the previous form submission. With this option, users don't have to refill the form (which is annoyting) if the form submission fails due to missing a required field, mistyping a CAPTCHA, etc.

### datalistIdEnding
Determines the ending for the datalist "id" property, and matching input "list" property. Default is "_LIST".

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

### many
The radio input, checkbox input, select, and datalist elements all use the "many" property. "many" contains an array of choices for a form element. These elements share the same "name" in the case of radio, and checkbox. For select and datalist elements they define "options"

### Additional Properties
"required" is an additional property in this case. Any property added without special handling (element, name, text, etc.) will be simply added to the form element. If the property doesn't have an associated value, as is the case with "required", just set the value to empty ("").

## Example: Radio Input

Note: The remaining examples do not include the "settings" or "form" syntax, just the syntax for each individual element. See the demo above for an example of creating a form with many elements.

This:
```JSON

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

### Special Features of Radio Input
- Each "many" item must contain an "id" and "text". 
- "text" defines the label text, and the input "value" property will be set to the "text" value by default. You can override this by defining a "value". 
- Each input is given the "name" defined by the element group settings.

## Example: Input Checkbox

This:
```JSON
{
  "element": "input",
  "type": "checkbox",
  "name": "PREFERRED_CLASSES",
  "many": [
    {
      "id": "ASTRONOMY",
      "text": "Astronomy"
    },
    {
      "id": "CHARMS",
      "text": "Charms"
    },
    {
      "id": "DEFENCE_AGAINST_THE_DARK_ARTS",
      "text": "Defence Against the Dark Arts"
    },
    {
      "id": "FLYING",
      "text": "Flying"
    },
    {
      "id": "HERBOLOGY",
      "text": "Herbology"
    },
    {
      "id": "HISTORY_OF_MAGIC",
      "text": "History of Magic"
    },
    {
      "id": "POTIONS",
      "text": "Potions"
    },
    {
      "id": "TRANSFIGURATION",
      "text": "Transfiguration"
    }
  ]
}
```
Generates this:
```PHP
$PREFERRED_CLASSES = $_GET['PREFERRED_CLASSES[]']);
 
<label for="ASTRONOMY">Astronomy</label>
<input type="checkbox" name="PREFERRED_CLASSES[]" value="Astronomy" id="ASTRONOMY"> 
<label for="CHARMS">Charms</label>
<input type="checkbox" name="PREFERRED_CLASSES[]" value="Charms" id="CHARMS"> 
<label for="DEFENCE_AGAINST_THE_DARK_ARTS">Defence Against the Dark Arts</label>
<input type="checkbox" name="PREFERRED_CLASSES[]" value="Defence Against the Dark Arts" id="DEFENCE_AGAINST_THE_DARK_ARTS"> 
<label for="FLYING">Flying</label>
<input type="checkbox" name="PREFERRED_CLASSES[]" value="Flying" id="FLYING"> 
<label for="HERBOLOGY">Herbology</label>
<input type="checkbox" name="PREFERRED_CLASSES[]" value="Herbology" id="HERBOLOGY"> 
<label for="HISTORY_OF_MAGIC">History of Magic</label>
<input type="checkbox" name="PREFERRED_CLASSES[]" value="History of Magic" id="HISTORY_OF_MAGIC"> 
<label for="POTIONS">Potions</label>
<input type="checkbox" name="PREFERRED_CLASSES[]" value="Potions" id="POTIONS"> 
<label for="TRANSFIGURATION">Transfiguration</label>
<input type="checkbox" name="PREFERRED_CLASSES[]" value="Transfiguration" id="TRANSFIGURATION"> 
```

### Special Features of Checkbox Input
- Includes same special features as radio input
- Additionally, the "name" property is given the array syntax name="NAME_OF_CHECKBOX_GROUP[]", as multiple checkboxes can be checked. 

## Example: Select

This:
```JSON
{
  "element": "select",
  "name": "FAVORITE_CANDY",
  "multiple": "",
  "text": "Favorite Candy",
  "many": [
    {
      "value": "CHOCOLATE_FROG",
      "text": "Chocolate Frog"
    },
    {
      "value": "ACID_POPS",
      "text": "Acid Pops"
    },
    {
      "value": "JELLY_SLUGS",
      "text": "Jelly Slugs"
    },
    {
      "value": "BERTIE_BOTTS_EVERY_FLAVOUR_BEANS",
      "text": "Bertie Bott&apos;s Every Flavour Beans"
    }
  ]
}
```
Generates this:
```PHP
$FAVORITE_CANDY = $_GET['FAVORITE_CANDY[]']);
 
<label for="FAVORITE_CANDY[]">Favorite Candy</label>
<select name="FAVORITE_CANDY[]" multiple> 
  <option value="CHOCOLATE_FROG">Chocolate Frog</option> 
  <option value="ACID_POPS">Acid Pops</option> 
  <option value="JELLY_SLUGS">Jelly Slugs</option> 
  <option value="BERTIE_BOTTS_EVERY_FLAVOUR_BEANS">Bertie Bott's Every Flavour Beans</option> 
</select> 
```
### Special Features of Select
- The "many" array defines the individual options for a select element.
- The array syntax name="MULTIPLE_OPTIONS[]" will be used if "multiple" is added as a group property.

## Example: Textarea

This:
```JSON
{
  "element": "textarea",
  "name": "MUGGLE_COMMENTS``",
  "text": "Tell us your least favourite thing about muggles:"
}
```
Generates this:
```PHP
$MUGGLE_COMMENTS = $_GET['MUGGLE_COMMENTS']);
 
<label for="MUGGLE_COMMENTS">Tell us your least favourite thing about muggles:</label>
<textarea name="MUGGLE_COMMENTS" id="MUGGLE_COMMENTS">Tell us your least favourite thing about muggles:</textarea> 
```

## Example: Button

This:
```JSON
{
  "element": "button",
  "name": "SUBMIT",
  "text": "Click to Submit",
  "class": "submit-button",
  "type": "submit"
}
```
Generates this:
```PHP
<button type="submit" name="SUBMIT" id="SUBMIT" class="submit-button">Click to Submit</button> 
```
### Special Features of Button
- PHP variables are not generated for buttons, as I assume that buttons will rarely be used to generate data that will actually be submitted with a form. 
- Not much typing saved in this case, but I included it for completeness. 

## Example: Datalist

This: 
```JSON
{
  "element": "datalist",
  "name": "FAVOURITE_TEACHER",
  "text": "Favourite Teacher",
  "wrapper": "div.input",
  "many": [
    {
      "value": "Albus Dumbledore"
    },
    {
      "value": "Cuthbert Binns"
    },
    {
      "value": "Firenze"
    },
    {
      "value": "Filius Flitwick"
    },
    {
      "value": "Wilhelmina Grubbly-Plank"
    },
    {
      "value": "Rubeus Hagrid"
    },
    {
      "value": "Rolanda Hooch"
    },
    {
      "value": "Silvanus Kettleburn"
    },
    {
      "value": "Gilderoy Lockhart"
    },
    {
      "value": "Remus Lupin"
    },
    {
      "value": "Minerva McGonagall"
    },
    {
      "value": "Alastor Moody"
    },
    {
      "value": "Quirinus Quirrell"
    },
    {
      "value": "Aurora Sinistra"
    },
    {
      "value": "Horace Slughorn"
    },
    {
      "value": "Severus Snape"
    },
    {
      "value": "Pomona Sprout"
    },
    {
      "value": "Sybill Trelawney"
    },
    {
      "value": "Septima Vector "
    }
  ]
}
```
Generates this:
```PHP
$FAVOURITE_TEACHER = $_GET['FAVOURITE_TEACHER'];
 
<div class="input">
  <label for="FAVOURITE_TEACHER">Favourite Teacher</label>
  <input list="FAVOURITE_TEACHER_LIST" name="FAVOURITE_TEACHER" id="FAVOURITE_TEACHER"> 
</div> 
<datalist id="FAVOURITE_TEACHER_LIST"> 
  <option value="Albus Dumbledore"> 
  <option value="Cuthbert Binns"> 
  <option value="Firenze"> 
  <option value="Filius Flitwick"> 
  <option value="Wilhelmina Grubbly-Plank"> 
  <option value="Rubeus Hagrid"> 
  <option value="Rolanda Hooch"> 
  <option value="Silvanus Kettleburn"> 
  <option value="Gilderoy Lockhart"> 
  <option value="Remus Lupin"> 
  <option value="Minerva McGonagall"> 
  <option value="Alastor Moody"> 
  <option value="Quirinus Quirrell"> 
  <option value="Aurora Sinistra"> 
  <option value="Horace Slughorn"> 
  <option value="Severus Snape"> 
  <option value="Pomona Sprout"> 
  <option value="Sybill Trelawney"> 
  <option value="Septima Vector "> 
</datalist> 
```

### Special Features of Datalist

-Only the "value" property needs to be set for each option. 
-The label, input, and datalist elements are all generated. The wrapper wraps the label and input, as the datalist itself is hidden. 
-The datalist "id" and input "list" must match, and be distinct from the "name" and "id" of the input element. As such, "_LIST" is simply added to the specified "name". This can be changed in the settings with property "datalistIdEnding".


