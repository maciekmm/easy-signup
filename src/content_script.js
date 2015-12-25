EasySignup.ContentScript = new function () {
	var fillers;
	var variables = [];

	function findField(form, keywords) {
		for (var i = 0; i < keywords.length; i++) {
			var keyword = keywords[i].toLowerCase();
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
			var labels = form.getElementsByTagName('label');
			for (var j = 0; j < labels.length; j++) {
				var label = labels[j];
				var content = label.innerHTML.toLowerCase();
				if (content.indexOf(keyword) >= 0) {
					input = document.getElementById(label.getAttribute("for"));
					if (input && !input.value) {
						return input;
					}
				}
			}
		}
		return undefined;
	}

	function fillForm(form) {
		Array.prototype.forEach.call(fillers, function (filler) {
			var field = findField(form, filler.keywords);
			if (!field) {
				console.log("Could not find for " + filler.keywords);
				return;
			}
			var value = filler.value;
			for (var i = 0; i < variables.length; i++) {
				value = value.replace('{' + variables[i].variable + '}', variables[i].replacement);
			}
			field.value = value;
			field.dispatchEvent(new Event('change', { 'bubbles': true }));
		});

		//Unsubscribe from newsletters
		var checkboxes = form.querySelectorAll(":checked");
		Array.prototype.forEach.call(checkboxes, function (element) {
			element.checked = false;
		});
	}

	function ensureFillers(callback) {
		if (!fillers) {
			chrome.storage.sync.get("fillers", function (resp) {
				fillers = resp.fillers;
				callback();
			});
		} else {
			callback();
		}
	}

	this.init = function () {
		variables.push(new EasySignup.Variable("hostname", window.location.hostname));
		var forms = document.getElementsByTagName("form");
		Array.prototype.forEach.call(forms, function (form) {
			if (form.querySelector('[type="password"]')) { //Password field determines whether the form is login/signup form
				ensureFillers(function () {
					fillForm(form);
				});
			}
		});
	};
} ();

EasySignup.ContentScript.init();
