var React = require('react');
var invariant = require('react/lib/invariant');

//error messages
var INVALID_CLOSING_TAG = 'tag: "%s" is not a valid closing tag';
var INVALID_CLOSING_TAG_PROPS = 'tag: "%s" cannot have props passed into it';
var INVALID_MULTIPLE_CLOSING_TAGS = 'attempted to pass in multiple closing tags: "%s" to el: "%s"';
var INVALID_TAG = 'tag: "%s" is not a valid tag';
var INVALID_NUMBER_OF_ARGUMENTS = 'there are multiple outermost r.compose tags. r.compose needs to return a single outermost tag same as with the normal React class render method return';
var INVALID_CLOSING_TAG_COUNT = 'There are not enough closing tags for this render composition';

//r FUNCTION: accepts a callback to build the component composition and then returns the output of that composition
//@param composition FUNCTION REQUIRED: callback which will define the composition of react components, this is the user's entrypoint into React-r
var r = function (composition) {
  //invoke callback and pass in h function for defining elements and t function for defining text
  composition(h, t);
  //return the composed elements
  return compose();
};

//checkIfValidClosingTag FUNCTION: checks if the passed in tag is a valid closing tag, checks both closing tags and self closing tags
//@param tag STRING REQUIRED: the tag to check for validity
//@oaram isSelfClosingTag BOOLEAN OPTIONAL: whether tag is self closing or not
var checkIfValidClosingTag = function (tag, isSelfClosing) {
  //trim whitespace
  var trimmedTag = tag.trim();
  //check if the last character is a '/' and the tag is self closing or if the first character is '/' and the tag is not self closing
  invariant(((trimmedTag[trimmedTag.length - 1] === '/' && isSelfClosing) || (trimmedTag[0] === '/' && !isSelfClosing)), INVALID_CLOSING_TAG, tag);
};

//h FUNCTION: creates element opening and closing tags, accepts props while doing so
//@param el STRING or OBJECT REQUIRED: the React Element to be created. If a string is passed in then the string to start with a closing tag, in which case it will close the last passed in element, or it can end with a closing tag, in which case the tag is self closing
//@param propsOrClosingTag STRING or OBJECT OPTIONAL: the properties of the element to be created, or, if a string is passed in, then the closing tag for the element passed in with el. If el is not closed then additional elements and text will be passed in as children until the element is closed
//@param elClosingTag STRING OPTIONAL: the closing tag for the passed in el. If el is not closed then additional elements and text will be passed in as children until the element is closed
var h = function (el, propsOrClosingTag, elClosingTag) {
  //default to null props value since this is the default value of props to pass into React.createElement
  var props = null;
  var closingTag;
  var trimmedEl;

  //handle propsOrClosingTag, if string then it should be the closing tag for el
  if (typeof propsOrClosingTag === 'string') {
    //if propsOrClosingTag is a valid closing tag then use it
    checkIfValidClosingTag(propsOrClosingTag, true);
    closingTag = propsOrClosingTag;
  //if object then it will be the props for the el
  } else if (propsOrClosingTag && typeof propsOrClosingTag === 'object') {

    props = propsOrClosingTag;

  }

  //handle elClosingTag, if it is defined then it should be the closing tag for el
  if (elClosingTag) {
    //if elClosingTag is a valid closing tag and there is no other closing tag then use it
    checkIfValidClosingTag(elClosingTag, true);
    invariant(!closingTag, INVALID_MULTIPLE_CLOSING_TAGS, closingTag, el);
    closingTag = elClosingTag;
  }

  //handle el, if it is a string then check if it is a closing or self closing tag
  if (typeof el === 'string') {
    //trim the element and then check if it is a closing tag or a self closing tag
    trimmedEl = el.trim();
    //if closing tag then set el to null and closing tag to el, closing tag and props should not be defined
    if (trimmedEl[0] === '/') {
      invariant(!closingTag, INVALID_MULTIPLE_CLOSING_TAGS, closingTag, el);
      invariant(!props, INVALID_CLOSING_TAG_PROPS, el);

      closingTag = el;
      el = null;
    //if self closing tag then closing tag is el, props can be defined but closing tag should not be
    } else if (trimmedEl[trimmedEl.length - 1] === '/') {
      invariant(!closingTag, INVALID_MULTIPLE_CLOSING_TAGS, closingTag, el);

      closingTag = el;
      el = trimmedEl.substr(0, trimmedEl.length - 1).trim();
    }
  }

  //push the assembled el into our components array
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
var components = [];

var composeCleanup = function (componentsLength) {
  invariant(currentIndex === componentsLength, INVALID_NUMBER_OF_ARGUMENTS);
  isOutermostInvocation = true;
  currentIndex = 0;
  reactElementToReturn = null;
  components = [];
};

var compose = function () {
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

      reactElement = React.createElement.apply(React, [].concat(elementOrString.el, elementOrString.props, compose()));
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
