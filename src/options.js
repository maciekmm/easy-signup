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
    new EasySignup.Filler(["username", "user", "name", "login"], "username")
  ]

  var fillers = [];

  // We might use some templating like handlebars
  
  function addFiller(form, filler) {
    var fieldset = document.createElement("fieldset");
    
    //Remove button
    var removeButton = document.createElement("button");
    removeButton.innerText = "- Remove filler";

    removeButton.addEventListener("click", function (event) {
      //Hacky, but works, oh well.
      event.preventDefault();
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
    addField.addEventListener("click", function (event) {
      event.preventDefault();
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
    return fieldset;
  }

  function addKeyword(filler, keyword) {
    var header = filler.getElementsByClassName("keyword-header")[0];
    var entry = document.createElement("dd");
    
    //Button for removing keyword
    var removeButton = document.createElement("button");
    removeButton.innerText = "-";
    removeButton.addEventListener("click", function (event) {
      event.target.parentElement.parentElement.removeChild(event.target.parentElement);
    });
    entry.appendChild(removeButton);
    
    //Input button for keyword name
    var input = document.createElement("input");
    input.type = "text";
    input.name = "keyword";
    if (keyword) {
      input.value = keyword;
    } else {
      input.value = "placeholder";
    }
    entry.appendChild(input);
    header.parentNode.insertBefore(entry, header.nextSibling);
  }

  function save(form) {
    var fillers = [];
    var rawFillers = form.getElementsByTagName("fieldset");
    for (var i = 0; i < rawFillers.length; i++) {
      var filler = new EasySignup.Filler([], rawFillers[i].querySelector('[name="value"]').value);
      //get keywords
      var rawKeywords = rawFillers[i].querySelectorAll('[name="keyword"]');
      for (var j = 0; j < rawKeywords.length; j++) {
        filler.keywords.push(rawKeywords[j].value);
      }
      fillers.push(filler);
    }
    chrome.storage.sync.set({ 'fillers': fillers });
  }

  function load() {
    var form = document.getElementById("fillers");
    chrome.storage.sync.get("fillers", function (resp) {
      if (isEmpty(resp)) {
        //setup defaults
        chrome.storage.sync.set({ 'fillers': defaultFillers });
        fillers = defaultFillers; //We don't need to clone this really.
      } else {
        fillers = resp.fillers;
      }
      fillers.forEach(function (element) {
        addFiller(form, element);
      });
    });
  }

  this.init = function () {
    if (chrome.identity) {
      chrome.identity.getProfileUserInfo(function (profile) {
        defaultFillers[0].value = profile.email;
        load();
      });
    } else {
      load();
    }
    
    var form = document.getElementById("fillers");
    var addButtons = document.getElementsByClassName("button-add-filler");
    Array.prototype.forEach.call(addButtons, function (element) {
      element.addEventListener("click", function (event) {
        event.preventDefault();
        addFiller(form, defaultFillers[0]).scrollIntoView();
      });
    });

    var saveButtons = document.getElementsByClassName("button-save");
    Array.prototype.forEach.call(saveButtons, function (element) {
      element.addEventListener("click", function (event) {
        event.preventDefault();
        save(form);
      });
    });
  };

} ();

EasySignup.Options.init();
