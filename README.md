# json-to-html-form
Creating forms is annoying, especially when you add PHP variables into the mix. Take for example, the humble input element:
```PHP
$xFIRST_NAME = $_GET['xFIRST_NAME']);
 
<label for="xFIRST_NAME">First Name</label>
<input type="text" name="xFIRST_NAME" value="" id="xFIRST_NAME" required> 
```
In creating this one form element...
