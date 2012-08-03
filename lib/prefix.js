// Generated by CoffeeScript 1.3.3
(function() {
  var parserlib,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  parserlib = require("parserlib");

  exports.css = function(input, text, blacklist) {
    var index, lines, options, parser, shift;
    if (blacklist == null) {
      blacklist = ['html', 'body'];
    }
    lines = input.split("\n");
    options = {
      starHack: true,
      ieFilters: true,
      underscoreHack: true,
      strict: false
    };
    parser = new parserlib.css.Parser(options);
    index = 0;
    shift = 0;
    parser.addListener("startrule", function(event) {
      var blacklisted, el, line, p, part, position, selector, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _results;
      _ref = event.selectors;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selector = _ref[_i];
        position = selector.col - 1;
        line = lines[selector.line - 1].split('');
        if (selector.line !== index) {
          shift = 0;
        }
        blacklisted = false;
        _ref1 = selector.parts;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          part = _ref1[_j];
          if (_ref2 = (_ref3 = part.elementName) != null ? _ref3.text : void 0, __indexOf.call(blacklist, _ref2) >= 0) {
            blacklisted = true;
            el = part.elementName.text;
            p = part.col - 1 + shift;
            if (p) {
              line = line.slice(0, (p - 1) + 1 || 9e9).concat(line.slice(p).join('').replace(new RegExp(el), text).split(''));
            } else {
              line = line.join('').replace(new RegExp(el), text).split('');
            }
          }
        }
        if (!blacklisted) {
          line.splice(position + shift, 0, text + ' ');
          shift += text.length + 1;
        }
        line = line.join('');
        line = line.replace(new RegExp(text + " *\> *" + text), text);
        lines[selector.line - 1] = line;
        _results.push(index = selector.line);
      }
      return _results;
    });
    parser.parse(input);
    return lines.join("\n");
  };

}).call(this);