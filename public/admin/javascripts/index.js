var Dropzone = require("dropzone"); // Activates all dropzones
//require("opentip"); // Activates all opentips
var marked = require('marked');
// var myDrop = $(".dropzone").dropzone();

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  langPrefix: 'language-',
  highlight: function(code, lang) {
    if (lang === 'js') {
      return highlighter.javascript(code);
    }
    return code;
  }
});