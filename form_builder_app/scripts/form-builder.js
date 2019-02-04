var FormBuilder = (function() {

  // Public interface
  var visible = {};

  // Private variables
  var inputElement;
  var createFormButton;
  var outputElement;
  var sendVariables = [];
  var requestMethod = "$_POST['VAR']";
  var requestMethodMany = '';
  var specialProperties = ['element', 'type', 'name', 'text', 
  'wrapper', 'noLabel', 'id', 'value', 'text', 'many'];


  // Misc. private variables
  var linebreak = '&nbsp;<br>';
  var indentValue = '&nbsp;&nbsp;';


  // JSON for storing list data
  var example = {
      "settings": {
        "requestMethod": "$_GET['VAR']",
        "requestMethodMany": ""
      },
      "form": [
        {
          "element": "input",
          "type": "text",
          "name": "xFIRST_NAME",
          "text": "First Name",
          "wrapper": "div.input.half",
          "noLabel": "true",
          "required": ""
        },
        {
          "element": "input",          
          "type": "radio",
          "name": "xHAIR_COLOR",
          "many": [
            {
              "id": "xBLOND",
              "text": "Blond",
              "value": "Blond",
              "wrapper": "div.input.quarter",
              "checked": ""
            },
            {
              "id": "xBRUNETTE",
              "text": "Brunette",
              "wrapper": "div.input.quarter"
            }
          ]
        },
        {
          "element": "input",          
          "type": "checkbox",
          "name": "xINTERESTS",
          "many": [
            {
              "id": "xWALKING_ON_BEACH",
              "text": "Walking on Beach",
              "class": "walking interests"
            },
            {
              "id": "xREADING_POETRY",
              "text": "Reading Poetry",
              "class": "reading-poetry interests"              
            },
            {
              "id": "xSKYDIVING",
              "text": "Skydiving",
              "class": "skydiving interests"              
            }
          ]
        },
        {
          "element": "select",
          "name": "xICE_CREAM_FLAVOR",
          "multiple": "",
          "wrapper": "div.input.full-width",
          "text": "Favorite Ice Cream",
          "many": [
            {
              "value": "xVANILLA",
              "text": "Vanilla" 
            },
            {
              "value": "xCHOCOLATE",
              "text": "Chocolate",
              "selected": ""
            },
            {
              "value": "xSTRAWBERRY",
              "text": "Strawberry",
              "class": "strawberry",
              "selected": ""
            }
          ]
        },
        {
          "element": "textarea",
          "wrapper": "div.half",
          "name": "xCOMMENTS",
          "text": "About you:",
          "class": "comments"
        },
        {
          "element": "button",
          "wrapper": "div.half",
          "name": "xSUBMIT",
          "text": "Click to Submit",
          "class": "submit-button",
          "type": "submit"
        }
      ]
    };


  // Initialize Options
  visible.initialize = function(options, callback)
  {
    // Get and set options variables
    inputElement = formBuilderElements.inputElement || false;
    createFormButton = formBuilderElements.createFormButton || false;
    outputElement = formBuilderElements.outputElement || false;

    addListeners();
    addExampleToInput();
  } 

  var addListeners = function()
  {
    createFormButton.addEventListener('click', function()
    {
      createForm();
    });   

    outputElement.addEventListener('click', function()
    {
      window.getSelection().selectAllChildren(this);      
    });
  }
  
  var addExampleToInput = function()
  {
    inputElement.value = JSON.stringify(example, null, 2);
  }


  var createForm = function() 
  {
    var data = JSON.parse(inputElement.value);
    var outputString = '';   
    sendVariables.length = 0;
    
    setRequestMethod(data);

    for(var i = 0; i < data.form.length; i++)
    {
      var formElement = data.form[i];

      outputString += createFormElement(formElement);
    }

    outputElement.innerHTML = createSendVariables() + linebreak + outputString;
  }


  var createFormElement = function(formElement)
  {
    var outputString = '';
    if(formElement.element)
    {
      switch (formElement.element)
      {
        case 'select':
          outputString = createSelect(formElement);
          break;
        case 'textarea':
          outputString = createTextarea(formElement);
          break;
        case 'button':
          outputString = createButton(formElement);
          break;
        case 'datalist':
          outputString = createDatalist(formElement);
          break;
        case 'input':
          outputString = createInput(formElement);
          break;
      }
    }

    return outputString;
  }


  var createInput = function(formElement)
  {
    outputString = '';
    switch (formElement.type)
    {
      case 'radio':
        thisOuputString = createRadioInput(formElement);
        break;
      case 'checkbox':
        thisOuputString = createCheckboxInput(formElement);
        break;
      default:
        outputString = createGenericInput(formElement);        
    }
    return outputString;
  }

  var createRadioInput = function(formElement)
  {
    outputString = '';
    sendVariables.push(formElement['name']);          

    for(var j = 0; j < formElement['many'].length; j++)
    {
      outputString += createLabelAndInput(j, formElement);
    }

    return outputString;    
  }

  var createCheckboxInput = function(formElement)
  {
    outputString = '';
    formElement['name'] = formElement['name'] + '[]';    
    sendVariables.push(formElement['name']);          

    for(var j = 0; j < formElement['many'].length; j++)
    {
      outputString += createLabelAndInput(j, formElement);
    }

    return outputString;      
  }

  var createGenericInput = function(formElement)
  {
    sendVariables.push(formElement.name);          
    outputString = createLabelAndInput(false, formElement);

    return outputString;       
  }

  var createTextarea = function(formElement)
  {
    details = formElement;
    var name = details.name;
    var outputString = '';
    sendVariables.push(name);

    var outputString = '';
    var thisFor = (details.id) ? details.id : name;
    var thisId = (details.id) ? details.id : name;
    var wrapperTags = createWrapperTags(details.wrapper);

    var label = setLabel(thisFor, details);
    var textarea = setTextarea(name, thisId, details);

    outputString = wrapperTags.start + label + textarea + wrapperTags.end;
    return outputString;    
  }

  var createButton = function(formElement)
  {
    details = formElement;
    var name = details.name;
    var outputString = '';

    var outputString = '';
    var thisId = (details.id) ? details.id : name;
    var wrapperTags = createWrapperTags(details.wrapper);

    var button = setButton(name, thisId, details);

    outputString = wrapperTags.start + button + wrapperTags.end;
    return outputString;       
  }

  var createSelect = function(formElement)
  {
    var details = formElement;
    outputString = '';
    thisName = '';

    if(details.hasOwnProperty('multiple'))
    {
      thisName = details.name + '[]';      
      sendVariables.push(thisName);
    }
    else 
    {
      thisName = details.name;      
      sendVariables.push(thisName); 
    }
    
    var wrapperTags = createWrapperTags(details.wrapper);
    var label = setLabel(thisName, details);
    var select = createSelectTags(thisName, details);
    var options = createOptions(details);

    outputString = wrapperTags.start + label + select.start + options + select.end + wrapperTags.end;

    return outputString;
  }

  var createSelectTags = function(name, details)
  {
    var selectTags = [];
    var indent = (details.wrapper) ? indentValue : '';    

    selectTags['start'] = indent + '&ltselect name="' + name + '" ' + setAdditionalAttributes(details) + '>' + linebreak;
    selectTags['end'] = indent + '&lt/select>' +linebreak;

    return selectTags;
  }

  var createOptions = function(details)
  {
    var options = details.many;
    var optionsString = '';
    var indent = (details.wrapper) ? indentValue + indentValue : indentValue;        

    for(var i = 0; i < options.length; i++)
    {
      var option = options[i];
      var additionalAttributes = setAdditionalAttributes(option);

      optionsString += indent + '&ltoption value="' + option.value + '"' + additionalAttributes + '>' + option.text + '&lt/option>' + linebreak;
    }

    return optionsString;
  }

  var createLabelAndInput = function(manyIndex, data)
  {
    var type = data.type;
    var name = data.name;
    var details;

    if(manyIndex !== false)
    {
      details = data['many'][manyIndex];
    }
    else
    {
      details = data;
    }

    var outputString = '';
    var thisFor = (details.id) ? details.id : name;
    var thisId = (details.id) ? details.id : name;
    var thisValue = setThisValue(details.value, type, details.text);
    var wrapperTags = createWrapperTags(details.wrapper);

    var label = setLabel(thisFor, details);
    var input = setInput(type, name, thisValue, thisId, details);

    outputString = wrapperTags.start + label + input + wrapperTags.end;
    return outputString;
  }

  var createSendVariables = function()
  {

    sendVariableString = '';

    for(var i = 0; i < sendVariables.length; i++)
    {
      thisVariableString = '';
      var phpVariable = '$' + sendVariables[i].replace('[]', '');

      var sendMethodString = ''
      if((sendVariables[i].includes('[]')) && (requestMethodMany !== ''))
      {
        sendMethodString = requestMethodMany.replace('VAR' , sendVariables[i]); 
      }
      else
      {
        sendMethodString = requestMethod.replace('VAR', sendVariables[i]); 
      }

      thisVariableString = phpVariable + ' = ' + sendMethodString + ');';
      formattedString = thisVariableString.replace(/</g, '&lt');
      sendVariableString += formattedString + '<br>';
    }

    return sendVariableString;
  }

  var setRequestMethod = function(data)
  {
    if(data.hasOwnProperty('settings'))
    {
      if(data.settings.requestMethod)
      {
        requestMethod = data.settings.requestMethod;
      }

      if(data.settings.requestMethodMany)
      {
        requestMethodMany = data.settings.requestMethodMany;
      }
    }
  }

  var createWrapperTags = function(wrapper)
  {
    var wrapperTags = [];
    var wrapperStartTag = '';
    var wrapperEndTag = '';


    if(wrapper)
    {
      var wrapperPartsArray = wrapper.split('.');

      wrapperStartTag = '&lt' + wrapperPartsArray[0] + ' ';

      if(wrapperPartsArray[1])
      {
        wrapperStartTag += 'class="';
        for(var i = 1; i < wrapperPartsArray.length; i++)
        {
          wrapperStartTag += wrapperPartsArray[i];
          if(i < (wrapperPartsArray.length - 1))
          {
            wrapperStartTag += ' ';
          }
        }
        wrapperStartTag += '"><br>';
      }

      wrapperEndTag = '&lt/' + wrapperPartsArray[0] + '>' + linebreak;
    }

    wrapperTags['start'] = wrapperStartTag;
    wrapperTags['end'] = wrapperEndTag;
    return wrapperTags;
  }

  var setThisValue = function(value, type, text)
  {
    thisValue = false;

    if(value)
    {
      thisValue = value;
    }
    else if((type === 'checkbox') || (type === 'radio'))
    {
     thisValue = text;
    }
    else
    {
      thisValue = '';
    }
    
    return thisValue;
  }

  var setLabel = function(thisFor, details)
  {
    var label = '';
    var text = (details.text) ? details.text : '';

    if(details.noLabel !== 'true')
    {
      var indent = (details.wrapper) ? indentValue : '';
      label = indent + '&ltlabel for="' + thisFor + '">' + text + '&lt/label><br>';
    }

    return label;
  }

  var setInput = function(type, name, thisValue, thisId, details)
  {
    var indent = (details.wrapper) ? indentValue : '';   
    var additionalAttributes = setAdditionalAttributes(details); 
    var input = indent + '&ltinput type="' + type + '" name="' + name + '"' + ' value="' + thisValue + '" id="' + thisId + '"' + additionalAttributes + '>' + linebreak;

    return input;
  }  

  var setTextarea = function(name, thisId, details)
  {
    var indent = (details.wrapper) ? indentValue : '';   
    var additionalAttributes = setAdditionalAttributes(details); 
    var textarea = indent + '&lttextarea name="' + name + '" id="' + thisId + '"' + additionalAttributes + '>' +
    details.text + '&lt/textarea>' + linebreak;

    return textarea;
  }  

  var setButton = function(name, thisId, details)
  {
    var indent = (details.wrapper) ? indentValue : '';   
    var additionalAttributes = setAdditionalAttributes(details); 
    var textarea = indent + '&ltbutton type="' + details.type + '" name="' + name + '" id="' + thisId + '"' + additionalAttributes + '>' +
    details.text + '&lt/button>' + linebreak;

    return textarea;
  }  

  var setAdditionalAttributes = function(details)
  {
    var additionalAttributes = ' ';
    for(var key in details)
    {
      if(details.hasOwnProperty(key))
      {
        if(!specialProperty(key))
        {
          var attributeString = createAttributeString(key, details[key]);
          additionalAttributes += attributeString;
        }
      }
    }

    if(additionalAttributes === ' ')
    {
      additionalAttributes = '';
    }
    
    return additionalAttributes;
  }

  var specialProperty = function(key)
  {
    var specialProperty = false;
    
    for(var i = 0; i < specialProperties.length; i++)
    {
      if(specialProperties[i] === key)
      {
        specialProperty = true;
        break;
      }
    }

    return specialProperty;
  }

  var createAttributeString = function(key, value)
  {
    attributeString = '';

    if(value)
    {
      attributeString = ' ' + key + '="' + value + '"'; 
    }
    else
    {
      attributeString = ' ' + key;
    }

    return attributeString;
  }

  // Return public interface
  return visible;
})();
