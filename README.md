# json-to-html-form
Creating forms is annoying, especially when you add PHP variables into the mix. Take for example, the humble input element:
```PHP
$xFIRST_NAME = $_GET['xFIRST_NAME']);
 
<label for="xFIRST_NAME">First Name</label>
<input type="text" name="xFIRST_NAME" value="" id="xFIRST_NAME" required> 
```
In creating this one form element I end up typing or copy/pasting "xFIRST_NAME" five times. That's time consuming and error prone. A few small mistakes in a form can mean an hour of troubleshooting. 

I'm sure many frameworks use simpler syntax to create forms, but at my job we still make them the old fashioned way with HTML and PHP. So to make this task a little easier, I've written a web app which creates forms from JSON. 
