var EasySignup = EasySignup || {

  isEmpty: function (obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }
};

EasySignup.Filler = function (keywords, value) {
  this.keywords = keywords;
  this.value = value;
}

EasySignup.Variable = function (variable, replacement) {
  this.variable = variable;
  this.replacement = replacement;
}