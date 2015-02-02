var React = require('react');
var invariant = require('react/lib/invariant');

var INVALID_CLOSING_TAG = 'tag: "%s" is not a valid closing tag';
var INVALID_TAG = 'tag: "%s" is not a valid tag';
var INVALID_NUMBER_OF_ARGUMENTS = 'there are multiple outermost r.compose tags. r.compose needs to return a single outermost tag same as with the normal React class render method return';
var INVALID_CLOSING_TAG_COUNT = 'There are not enough closing tags for this render composition';

var checkIfValidClosingTag = function (tag, isSelfClosing) {
  var trimmedTag = tag.trim();
  if ((trimmedTag[trimmedTag.length - 1] !== '/' && isSelfClosing) || (trimmedTag[0] !== '/') && !isSelfClosing) {
    invariant(INVALID_CLOSING_TAG, tag);
  }
};

var r = function (composition) {
  composition(h, t);
  return r.compose();
};

var components = [];

var h = function (el, propsOrClosingTag, elClosingTag) {
  var props = null;
  var closingTag;
  var trimmedEl;

  if (typeof propsOrClosingTag === 'string') {
    checkIfValidClosingTag(propsOrClosingTag, true);
    closingTag = propsOrClosingTag;
  } else if (propsOrClosingTag && typeof propsOrClosingTag === 'object') {
    props = propsOrClosingTag;
    if (elClosingTag) {
      checkIfValidClosingTag(elClosingTag, true);
      closingTag = elClosingTag;
    }
  }

  if (typeof el === 'string') {
    trimmedEl = el.trim();
    if (trimmedEl[0] === '/') {
      components.push({
        el: null,
        closingTag: el
      });
      return;
    } else if (trimmedEl[trimmedEl.length - 1] === '/') {
      closingTag = el;
      el = trimmedEl.substr(0, trimmedEl.length - 1).trim();
    }
  }

  components.push({
    el: el,
    props: props,
    closingTag: closingTag
  });
};

var t = function (text) {
  components.push(text);
};

var isOutermostInvocation = true;
var currentIndex = 0;
var reactElementToReturn = null;

var composeCleanup = function (componentsLength) {
  invariant(currentIndex === componentsLength, INVALID_NUMBER_OF_ARGUMENTS);
  isOutermostInvocation = true;
  currentIndex = 0;
  reactElementToReturn = null;
  components = [];
};

r.compose = function () {
  var setOutermostInvocation = false;
  if (isOutermostInvocation) {
    setOutermostInvocation = true;
    isOutermostInvocation = false;

  } else {
    children = [];
  }

  var children;
  var componentsLength = components.length;
  var reactElement;
  var elementOrString;
  while (currentIndex < componentsLength) {
    elementOrString = components[currentIndex];
    currentIndex++;

    if (typeof elementOrString === 'string') {

      invariant(!setOutermostInvocation, INVALID_TAG, elementOrString);
      children.push(elementOrString);

    } else if (elementOrString.el && elementOrString.closingTag) {

      reactElement = React.createElement(elementOrString.el, elementOrString.props);
      if (setOutermostInvocation) {
        composeCleanup(componentsLength);
        return reactElement;
      } else {
        children.push(reactElement);
      }

    } else if (elementOrString.el) {

      reactElement = React.createElement.apply(React, [].concat(elementOrString.el, elementOrString.props, r.compose()));
      if (setOutermostInvocation) {
        invariant(components[currentIndex - 1].closingTag, INVALID_CLOSING_TAG_COUNT);
        composeCleanup(componentsLength);
        return reactElement;
      } else {
        children.push(reactElement);
      }

    } else if (elementOrString.closingTag) {
      return children;
    }
  }
  invariant(false, INVALID_CLOSING_TAG_COUNT);
};

module.exports = r;
