var React = require('react');
var invariantError = require('react/lib/invariant');

var invariant = function (assertion, errorMessage, replacements) {
  if (!assertion) {
    elComposition = [];
    invariantError.apply(null, arguments);
  }
};

//error messages
var INVALID_CLOSING_TAG = 'tag: "%s" is not a valid closing tag';
var INVALID_CLOSING_TAG_PROPS = 'tag: "%s" cannot have props passed into it';
var INVALID_MULTIPLE_CLOSING_TAGS = 'attempted to pass in multiple closing tags: "%s" to el: "%s"';
var INVALID_TAG = 'tag: "%s" is not a valid tag';
var INVALID_NUMBER_OF_ARGUMENTS = 'there are multiple outermost tags. r needs to return a single outermost tag same as with the normal React class render method return';
var INVALID_CLOSING_TAG_COUNT_TOO_FEW = 'there are not enough closing tags for this render composition';
var INVALID_CLOSING_TAG_COUNT_TOO_MANY = 'there are too many closing tags for this render composition: "%s"';
var INVALID_REACT_ELEMENT_PROPS = 'attempted to pass in props to a React element that has already been created, props should have been passed in when the element was created initially';
var INVALID_REACT_ELEMENT_CLOSING_TAG = 'attempted to add a closing tag to a React element that has already been created, since the element has already been created it is self-closing and thus a closing tag is unnecessary';
var INVALID_ARRAY_OF_ELEMENTS_PROPS = 'attempted to pass in props to an array of React elements, props should have been passed in when the elements were created initially';
var INVALID_ARRAY_OF_ELEMENTS_CLOSING_TAG = 'attempted to add a closing tag to an array of React elements, since the elements have already been created they are self-closing and thus a closing tag is unnecessary';
var INVALID_OUTERMOST_ARRAY_OF_ELEMENTS = 'attempted to compose an outermost array of elements. We can only return a single React element. Instead of returning an array, pass the array in as a child to a single element such as a div';
var INVALID_PROPS_OR_CLOSING_TAG = 'attempted to pass an invalid second argument to element creating function (first argument passed into r callback): "%s". Second argument must either be an object representing the properties of the element or the element closing function (second argument passed into r callback)';
var INVALID_CLOSING_TAG = 'attempted to pass an invalid closing argument to element creator function (first argument passed into r callback): "%s". Closing argument must be the element closing function (second argument passed into r callback)';
var INVALID_MISMATCHED_TAGS = 'the opening tag: "%s" does not match with the closing tag: "%s"';

//r FUNCTION: accepts a callback to build the component composition and then returns the output of that composition
//@param composition FUNCTION REQUIRED: callback which will define the composition of react components, this is the user's entrypoint into React-r
var r = function (composition) {
  //invoke callback and pass in h function for defining elements and t function for defining text
  composition($, y$, t);
  invariant(elComposition.length === 1, INVALID_CLOSING_TAG_COUNT_TOO_FEW);
  //return the composed elements
  return elComposition.shift();
};

var elComposition = [];

var addArrayToCurrentElCompositionLayer = function (arrayOfEls) {
  invariant(elComposition.length !== 1, INVALID_OUTERMOST_ARRAY_OF_ELEMENTS);
  addToCurrentElCompositionLayer(arrayOfEls);
};

var addToCurrentElCompositionLayer = function (reactEl) {
  var layer = elComposition[elComposition.length - 1];
  if (elComposition.length > 1) {
    layer.push(reactEl);
  } else {
    invariant(elComposition.length !== 1, INVALID_NUMBER_OF_ARGUMENTS);
    elComposition.push(reactEl);
  }
};

var $ = function (el, propsOrClosingTag, elClosingTag) {
  //default to null props value since this is the default value of props to pass into React.createElement
  var props = null;
  var closingTag;
  var trimmedEl;
  var isReactElement;
  var isArray;

  //handle propsOrClosingTag, if string then it should be the closing tag for el
  if (propsOrClosingTag) {
    invariant(typeof propsOrClosingTag === 'object' || typeof propsOrClosingTag === 'function', INVALID_PROPS_OR_CLOSING_TAG, propsOrClosingTag);
    if (propsOrClosingTag.__isReactRClosingTagFunc__) {
      closingTag = propsOrClosingTag;
    } else {
      props = propsOrClosingTag;
    }
  }

  //handle elClosingTag, if it is defined then it should be the closing tag for el
  if (elClosingTag) {
    invariant(!closingTag, INVALID_MULTIPLE_CLOSING_TAGS, closingTag, el);
    invariant(elClosingTag.__isReactRClosingTagFunc__, INVALID_CLOSING_TAG);
    closingTag = elClosingTag;
  }

  //if el is already a react element, props should not be defined
  if (React.isValidElement(el)) {
    invariant(!props, INVALID_REACT_ELEMENT_PROPS);
    //set boolean to indicate this is a React element
    isReactElement = true;
    closingTag = y$;

  //if el is an array, props should not be defined
  } else if (Array.isArray(el)) {
    invariant(!props, INVALID_ARRAY_OF_ELEMENTS_PROPS);
    //set boolean to indicate this is an array of React elements
    isArray = true;
    closingTag = y$;
  }

  //if closing tag create react element (or use already created element) and add to composition
  if (closingTag) {
    if (!isReactElement && !isArray) {
      addToCurrentElCompositionLayer(React.createElement(el, props));
    } else if (isArray) {
      addArrayToCurrentElCompositionLayer(el);
    } else {
      addToCurrentElCompositionLayer(el);
    }

  //if no closing tag define object for creating a react element, add to composition, and increment layer count
  } else {
    addToCurrentElCompositionLayer({
      el: el,
      props: props
    });
    elComposition.push([]);
  }
};

var y$ = function (closingEl) {
  invariant(elComposition.length > 1, INVALID_CLOSING_TAG_COUNT_TOO_MANY, closingEl);
  var children = elComposition.pop();
  var elList = elComposition[elComposition.length - 1];
  var elToClose;
  if (elComposition.length !== 1) {
    elToClose = elList[elList.length - 1];
  } else {
    elToClose = elList;
  }
  invariant(elToClose.el === closingEl, INVALID_MISMATCHED_TAGS, elToClose.el, closingEl);
  var reactEl = React.createElement.apply(React, [elToClose.el, elToClose.props].concat(children));
  if (elComposition.length === 1) {
    elComposition[0] = reactEl;
  } else {
    elList[elList.length - 1] = reactEl;
  }
};

y$.__isReactRClosingTagFunc__ = true;

var t = function (text) {
  invariant(elComposition.length !== 1, INVALID_TAG, text);
  addToCurrentElCompositionLayer(text);
};

module.exports = r;
