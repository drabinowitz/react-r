# React-r

>A library for writing JSX-like syntax in JavaScript

## Summary

React is awesome, the virtual DOM is awesome, JSX is less awesome. It's a nice way of describing HTML elements in JavaScript, but it means learning a whole new language and adding another compiler to your JS files. In terms of future proofing it's a lot of weight to take on for a cleaner syntax. React-r provides a syntax for writing JavaScript that looks and acts a lot like JSX but without the baggage of a new language to compile.

## Installation

React-r is an npm module so install it and require it in

```sh
npm install --save react-r
```

in your React Class

```javascript
var React = require('react');
var r = require('react-r');
```

##Getting Started

Let's get started with an example

```javascript
var React = require('react');
var r = require('react-r');

var HelloWorld = React.createClass({
  render: function () {
    return r(function ($, y$, t) {
      $('h1');
        t('Hello World!');
      y$('h1');
    });
  }
});

module.exports = HelloWorld;
```

Alright I know it looks a little weird but hear me out, I use `$` here because it's a clean divider for an element but you can use whatever you want and there is basically a parallel between `$` and an opening element tag and `y$` and a closing element tag

Which means we can write stuff like

```javascript
var React = require('react');
var r = require('react-r');

var HelloInput = React.createClass({
  render: function () {
    return r(function ($, y$, t) {
      $('input', {type: 'text'}, y$);
    });
  }
});

module.exports = HelloInput;
```

and more complicated elements like

```javascript
var React = require('react');
var r = require('react-r');

var ComplexEl = React.createClass({
  render: function () {
    return r(function ($, y$, t) {
      $('div');
        $('h1', {className: 'header'});
          t('This is a Complex Element');
        y$('h1');
        $('br', y$);
        $('div', {className: 'wrapper'});
          $('p');
            t('Some Text');
          y$('p');
          $('input', {
            type: 'text',
            placeholder: 'Fill Me Out'
          }, y$);
        y$('div');
      y$('div');
    });
  }
});

module.exports = ComplexEl;
```

We can also render nested elements, arrays of elements, and composite elements like

```javascript
var React = require('react');
var r = require('react-r');
var HelloWorld = require('./HelloWorld');

var NestedEl = React.createClass({
  render: function () {
    var childEl = r(function ($, y$, t) {
      $('h1');
        t('a child element');
      y$('h1');
    });

    var childArray = [childEl, childEl];

    return r(function ($, y$, t) {
      $('div');
        //since this has already been composed we don't need to close it
        $(childEl);
        //but we can just for consistency's sake
        $(childArray, y$);
        $(HelloWorld, y$);
      y$('div');
    });
  }
});

module.exports = NestedEl;
```

Note here that we are taking real advantage of the fact that we have a normal JS scope so we can actually write comments

That's not all we're back in the world of JavaScript, which means we no longer have to deal with the weird rules of writing in JSX (extra curly braces and ternaries for instance) or compiling to JS or anything. But we can also do stuff like

```javascript
var React = require('react');
var r = require('react-r');

var ScopingEl = React.createClass({
  getInitialState: function () {
    return {
      loading: true
    };
  },

  componentDidMount: function () {
    setTimeout(function () {
      this.setState({loading: false});
    }.bind(this), 2000);
  },

  render: function () {
    return r(function ($, y$, t) {
      $('div');
        $('h1');
          if (this.state.loading) {
            t('loading something over here');
          } else {
            t('done loading');
          }
        y$('h1');
        $('ol');
          for (var i = 0; i < 10; i++) {
            $('li', {key: i});
              t('list element: ' + i);
            y$('li');
            $('br', y$);
          }
        y$('ol');
      y$('div');
    }.bind(this));
  }
});

module.exports = ScopingEl;
```

Oh and since we don't have to use JSX anymore, that means no more Spread syntax for sharing properties. We can now use the full suite of object methods for cascading down properties from parent to child.

```javascript
var React = require('react');
var r = require('react-r');
var assign = require('object-assign');

var CascadingEl = React.createClass({
  render: function () {
    return r(function ($, y$, t) {
      $('h1', assign(this.props));
        t('Passed down props from parent to me.');
      y$('h1');
    }.bind(this));
  }
});

module.exports = CascadingEl;
```

## Next Steps

Check out the [API Docs](docs/API.md) for a full description of the app.

Check out the [Example App](drabinowitz.github.io/drabinowitz/react-r).
