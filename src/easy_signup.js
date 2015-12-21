var EasySignup = EasySignup || {};

EasySignup.Filler = function (keywords, value) {
  this.keywords = keywords;
  this.value = value;
}

EasySignup.Variable = function (variable, replacement) {
  this.variable = variable;
  this.replacement = replacement;
}