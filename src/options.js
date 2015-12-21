EasySignup.Options = new function () {

  function isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }

    return true;
  }

  var defaultFillers = [
    new EasySignup.Filler(["mail"], "example@example.com"),
    new EasySignup.Filler(["username"], "exampleUsername")
  ]

  var fillers = [];

  // We might use some templating like handlebars
  
  function addFiller(form, filler) {
    var fieldset = document.createElement("fieldset");
    
    //Remove button
    var removeButton = document.createElement("button");
    removeButton.className = "button-remove-filler";
    removeButton.innerText = "- Remove filler";

    removeButton.addEventListener("click", function (event) {
      //Hacky, but works, oh well.
      event.target.parentElement.parentElement.removeChild(event.target.parentElement);
    });

    fieldset.appendChild(removeButton);
    
    //Definitions list
    var defList = document.createElement("dl");
    var keywordsHeader = document.createElement("dt");
    keywordsHeader.className = "keyword-header";
    keywordsHeader.innerHTML = 'Keywords'; //Will this work?
    
    var addField = document.createElement("button");
    addField.innerText = "+";
    addField.className = "button-add-keyword";
    addField.addEventListener("click",function(event) {
      addKeyword(fieldset);
    });
    keywordsHeader.appendChild(addField);
    
    defList.appendChild(keywordsHeader);

    var valueHeader = document.createElement("dt");
    valueHeader.innerHTML = 'Value';
    defList.appendChild(valueHeader);

    //Value/replacement
    var valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.value = filler.value;
    valueInput.name = "value";
    defList.appendChild(valueInput); //Might be an overkill
        
    fieldset.appendChild(defList);

    filler.keywords.forEach(function (element) {
      addKeyword(fieldset, element);
    });

    form.appendChild(fieldset);
  }

  function addKeyword(filler, keyword) {
    var header = filler.getElementsByClassName("keyword-header")[0];
    var entry = document.createElement("dd");
    
    //Button for removing keyword
    var removeButton = document.createElement("button");
    removeButton.innerText = "-";
    removeButton.className = "button-remove-keyword";
    removeButton.addEventListener("click", function (event) {
      event.target.parentElement.parentElement.removeChild(event.target.parentElement);
    });
    entry.appendChild(removeButton);
    
    //Input button for keyword name
    var input = document.createElement("input");
    input.type = "text";
    if (keyword) {
      input.value = keyword;
    } else {
      input.value = "placeholder";
    }
    entry.appendChild(input);
    header.parentNode.insertBefore(entry, header.nextSibling);
  }



  this.init = function () {
    chrome.storage.sync.get("fillers", function (resp) {
      if (isEmpty(resp)) {
        //setup defaults
        console.log("test");
        chrome.storage.sync.set({ 'fillers': defaultFillers });
        fillers = defaultFillers; //We don't need to clone this really.
      } else {
        fillers = resp.fillers;
      }
      var form = document.getElementById("fillers");
     
      fillers.forEach(function (element) {
        addFiller(form, element);
      });
    });
  };

} ();

EasySignup.Options.init();
