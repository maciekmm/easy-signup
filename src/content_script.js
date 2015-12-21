EasySignup.ContentScript = new function() {
  var fillers = [];
  
  function findField(form, keywords) {
    Array.prototype.forEach.call(keywords, function(keyword) {
      keyword = keyword.toLowerCase();
      //Maybe field name contains given keyword
      var input = form.querySelector('input[name*=' + keyword + ']');
      if (input && !input.value) {
        return input;
      }
      //Maybe keyword is hidden in placeholder
      input = form.querySelector('input[placeholder*=' + keyword + ']');
      if (input && !input.value) {
        return input;
      }
      //Maybe field has label
      labels = form.getElementsByTagName('label');
      Array.prototype.forEach.call(labels, function(label) {
        content = label.innerHTML.toLowerCase();
        if (content.indexOf(keyword) > 0) {
          input = form.getElementById(label.getAttribute("for"));
          if (input && !input.value) {
            return input;
          }
        }
      });
    });
    return undefined;
  }

  function fillForm(form) {
    console.log("test");
    Array.prototype.forEach.call(fillers, function(filler) {
      field = findField(form, filler.keywords);
      if (!field) {
        console.log("Could not find for " + filler);
      }
      field.value = filler.value;
    });

    //Unsubscribe from newsletters
    var checkboxes = form.querySelectorAll(":checked");
    Array.prototype.forEach.call(checkboxes, function(element) {
      element.checked = false;
    });
  }

  function ensureFillers(callback) {
    if (!fillers) {
      chrome.storage.sync.get("fillers", function(resp) {
        fillers = resp.fillers;
        callback();
      });
    }
    callback();
  }

  this.init = function() {
    var forms = document.getElementsByTagName("form");
    console.log(forms);
    Array.prototype.forEach.call(forms, function(form) {
      
      if (form.querySelector('[type="password"]')) { //Password field determines whether the form is login/signup form
        ensureFillers(function() {
          fillForm(form);
        });
      }
    });
  };
}();

EasySignup.ContentScript.init();
