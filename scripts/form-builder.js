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
  var echoValues = false;
  var specialProperties = ['element', 'type', 'name', 'text', 
  'wrapper', 'noLabel', 'id', 'value', 'text', 'many'];
  var datalistIdEnding = '_LIST';
  var outputAreaClickTime;


  // Misc. private variables
  var linebreak = '&nbsp;<br>';
  var indentValue = '&nbsp;&nbsp;';


  // JSON for storing list data
  var example = {
      "settings": {
        "requestMethod": "FixPostVar(VAR)",
        "requestMethodMany": "FixPostArr(VAR)",
        "echoValues": "",
        "datalistIdEnding": ""
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
        },
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
        },
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
              "text": "Defence Against the Dark Arts",          
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
        },
        {
          "element": "select",
          "name": "FAVORITE_CANDY",
          "text": "Favorite Candy",
          "many": [
            {
              "value": "Chocolate Frog", 
            },
            {
              "value": "Acid Pops"
            },
            {
              "value": "Jelly Slugs"
            },
            {
              "value": "Bertie Bott's Every Flavour Beans"
            }
          ]
        },
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
        },
        {
          "element": "textarea",
          "name": "MUGGLE_COMMENTS"
        },
        {
          "element": "button",
          "name": "SUBMIT",
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
      newTime = Date.now();

      if(outputAreaClickTime && (newTime - outputAreaClickTime) < 500)
      {
        window.getSelection().selectAllChildren(this); 
        outputAreaClickTime = newTime;        
      }   
      else
      {
        outputAreaClickTime = newTime;
      }   
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
    
    setCustomSettings(data);
    

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
        case 'button':
          outputString = createButton(formElement);
          break;      
        case 'datalist':
          outputString = createDatalist(formElement);
          break;
        case 'input':
          outputString = createInput(formElement);
          break;            
        case 'select':
          outputString = createSelect(formElement);
          break;
        case 'textarea':
          outputString = createTextarea(formElement);
          break;
      }
    }

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

  var setButton = function(name, thisId, details)
  {
    var indent = (details.wrapper) ? indentValue : '';   
    var additionalAttributes = setAdditionalAttributes(details); 
    var button = indent + '&ltbutton type="' + details.type + '" name="' + name + '" id="' + thisId + '"' + additionalAttributes + '>' +
    details.text + '&lt/button>' + linebreak;

    return button;
  }  

  var createDatalist = function(formElement)
  {
    sendVariables.push(formElement.name);
    formElement.type = formElement.element;
    outputString = createLabelAndInput(false, formElement);
    outputString += setDatalist(formElement);

    return outputString;
  }

  var setDatalist = function(details)
  {
    var options = details.many;
    var datalistString = '';
    var optionsString = ''; 

    datalistStart = '&ltdatalist id="' + details.name + datalistIdEnding + '"' + setAdditionalAttributes(details) + '>' + linebreak;
    datalistEnd = '&lt/datalist>' + linebreak;    

    for(var i = 0; i < options.length; i++)
    {
      var option = options[i];
      var value = option.value;

      var additionalAttributes = setAdditionalAttributes(option);
      var selected = (echoValues) ? ' &lt?php if($' + details.name + ' === "' + value + '"){echo "selected";} ?> ' : '';

      optionsString += indentValue + '&ltoption value="' + value + '"' + selected + additionalAttributes + '>' + linebreak;
    }

    datalistString = datalistStart + optionsString + datalistEnd;
    return datalistString;
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
    sendVariables.push(formElement['name']);      
    formElement['name'] = formElement['name'] + '[]';            

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

  var createSelect = function(formElement)
  {
    var details = formElement;
    outputString = '';
    thisName = '';

    if(details.hasOwnProperty('multiple'))
    {
      sendVariables.push(thisName);      
      thisName = details.name + '[]';      
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

    selectTags['start'] = indent + '&ltselect name="' + name + '"' + setAdditionalAttributes(details) + '>' + linebreak;
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
      var value = option.value;
      var text = (option.text) ? option.text : option.value;

      var selected = (echoValues) ? '&lt?php if($' + details.name + ' === "' + value + '"){echo "selected";} ?> ' : '';
      var additionalAttributes = setAdditionalAttributes(option);``

      optionsString += indent + '&ltoption value="' + value + '" ' +  selected + additionalAttributes + '>' + text + '&lt/option>' + linebreak;
    }

    return optionsString;
  }

  var createTextarea = function(formElement)
  {
    details = formElement;
    var name = details.name;
    var text = details.text;
    var outputString = '';
    sendVariables.push(name);

    if(!text && echoValues)
    {
      text = '&lt?php echo $' + name + '; ?>';
    }

    var outputString = '';
    var thisFor = (details.id) ? details.id : name;
    var thisId = (details.id) ? details.id : name;
    var wrapperTags = createWrapperTags(details.wrapper);

    var label = setLabel(thisFor, details);
    var textarea = setTextarea(name, thisId, text, details);

    outputString = wrapperTags.start + label + textarea + wrapperTags.end;
    return outputString;    
  }

  var setTextarea = function(name, thisId, text, details)
  {
    var indent = (details.wrapper) ? indentValue : '';   
    var additionalAttributes = setAdditionalAttributes(details); 
    var textarea = indent + '&lttextarea name="' + name + '" id="' + thisId + '"' + additionalAttributes + '>' +
    text + '&lt/textarea>' + linebreak;

    return textarea;
  }  

  ///////////////////////////////////////////
  // Functions used by multiple form elements
  ///////////////////////////////////////////

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
    var thisValue = setThisValue(details.value, type, details.text, name);
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

      thisVariableString = phpVariable + ' = ' + sendMethodString + ';';
      formattedString = thisVariableString.replace(/</g, '&lt');
      sendVariableString += formattedString + '<br>';
    }

    return sendVariableString;
  }

  var setCustomSettings = function(data)
  {
    if(data.hasOwnProperty('settings'))
    {
      if(data.settings.hasOwnProperty('requestMethod') && data.settings.requestMethod)
      {
        requestMethod = data.settings.requestMethod;
      }
      else
      {
        requestMethod = false;
      }

      if(data.settings.hasOwnProperty('requestMethodMany') && data.settings.requestMethodMany)
      {
        requestMethodMany = data.settings.requestMethodMany;
      }
      else
      {
        requestMethodMany = false;
      }

      if(data.settings.hasOwnProperty('datalistIdEnding') && data.settings.datalistIdEnding)
      {
        datalistIdEnding = data.settings.datalistIdEnding;
      }
      else
      {
        dataListIdEnding = false;
      }

      if(data.settings.hasOwnProperty('echoValues'))
      {
        echoValues = true;
      }      
      else
      {
        echoValues = false;
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

  var setThisValue = function(value, type, text, name)
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
    else if(echoValues)
    {
      thisValue = '&lt?php echo $' + name + '; ?>';
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

    if(!details.noLabel)
    {
      var indent = (details.wrapper) ? indentValue : '';
      label = indent + '&ltlabel for="' + thisFor + '">' + text + '&lt/label><br>';
    }

    return label;
  }

  var setInput = function(thisType, name, thisValue, thisId, details)
  {
    var value = '';
    var list = '';
    var type = '';
    var checked = '';

    if(details.element === 'datalist')
    {
      list = ' list="' + name + datalistIdEnding + '" ';
    }
    else
    {
      value = ' value="' + thisValue + '" ';
      type = ' type="' + thisType + '" ';
    }

    if(thisType === 'checkbox' && echoValues)
    {
      checked = ' &lt?php echo in_array("' + thisValue + '", $' + name + ') ? \'checked = "checked"\' :  "";  ?>';
    }

    if(thisType === 'radio' && echoValues)
    {
      checked = ' &lt?php if($' + name + ' === "' + thisValue + '"){echo \'checked = "checked"\';} ?>' 
    }    

    var indent = (details.wrapper) ? indentValue : '';   
    var additionalAttributes = setAdditionalAttributes(details); 
    var input = indent + '&ltinput' + list + type + 'name="' + name + '" ' + value + 'id="' + thisId + '"' + checked + additionalAttributes + '>' + linebreak;

    return input;
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
