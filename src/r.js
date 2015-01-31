var React = require('react');
module.exports = function (el) {
  if (!el) {
    throw new Error('element must be defined');
  }
  if (el[el.length - 1] === '/') {
    el = el.substr(0, el.length - 1);
    el = el.trim();
  }
  if (arguments.length === 1) {
    return React.createElement(el, null);
  } else {
    var propsChildrenOrText = arguments[1];
    if (typeof propsChildrenOrText === 'string') {
      return React.createElement(el, null, propsChildrenOrText);
    } else if (typeof propsChildrenOrText === 'object') {
      return React.createElement(el, propsChildrenOrText);
    }
  }
};

