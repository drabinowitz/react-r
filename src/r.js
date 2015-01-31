var React = require('react');
var invariant = require('react/lib/invariant');

var INVALID_TAG_ERROR = 'tag: "%s" is not a valid closing tag';

var checkIfValidClosingTag = function (tag, isSelfClosing) {
  var trimmedTag = tag.trim();
  if ((trimmedTag[trimmedTag.length - 1] !== '/' && isSelfClosing) || (trimmedTag[0] !== '/') && !isSelfClosing) {
    invariant(INVALID_TAG_ERROR, tag);
  }
};

var r = function (el, propsOrClosingTag, elClosingTag) {
  var props = null;
  var closingTag;
  if (typeof el === 'string') {
    if (el[0] === '/') {
      return {
        element: null,
        closingTag: el
      };
    }
  }
  if (typeof propsOrClosingTag === 'string') {
    checkIfValidClosingTag(propsOrClosingTag, true);
    closingTag = propsOrClosingTag;
  } else {
    props = propsOrClosingTag;
    if (elClosingTag) {
      checkIfValidClosingTag(elClosingTag, true);
      closingTag = elClosingTag;
    }
  }
  return {
    element: el,
    props: props,
    closingTag: closingTag
  };
};

r.compose = function () {
  var firstArg = arguments[0];
  if (typeof firstArg === 'string') {
    return firstArg;
  }
  if (firstArg.el && firstArg.closingTag) {

  }
};

module.exports = r;
