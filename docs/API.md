# API

## Table of Contents

1. r(composeCallback)
2. $(el, propsOrClosingTag, closingTag)
3. y$(el)
4. t(text)

## Implementation

### r(composeCallback)

Accepts a callback to build our element composition and invokes it, passing in the element creating function, element closing function, and text element function. It uses the result of this callback to return a created React element.

```javascript
r(function ($, y$, t) {
  //element composition
});
```

@param `$` FUNCTION REQUIRED: The opening tag for the element. This receives the element class to create and (optionally) props and a closing tag.
@param `y$` FUNCTION REQUIRED: The closing tag for the element. This is a function which takes an element to close. Alternatively, it can be passed in to self-closing elements.
@param `t` FUNCTION REQUIRED: The text content of an element. This adds a text element as a child of the element to create.

### $(elementToCreate, propsOrClosingTag, closingTag)

Accepts an element and, optionally, props and/or a closing tag. If no closing tag is passed in, the element will be left open and future elements will be passed in as children until the element is closed.

```javascript
$(el, props, y$); //or
$(el, y$); //or
$(el);
  //child elements
y$(el);
```
@param `el` STRING or OBJECT REQUIRED: The element to create. This can either be a string representing the React DOM element to be created or a React Composite Class (result of calling `React.createClass`) to be created.
@param `props` OBJECT OPTIONAL: An object representing the props of the element to create.
@param `y$` FUNCTION OPTIONAL: The element to close.

### y$(elementToClose)

Accepts an element to close. This must match with the most recently opened element. This is also the closing tag, which we will pass in to the above `$` function in order to produce self-closing elements.

```javascript
$(el);
  //child elements
y$(el);
```

@param `el` STRING or OBJECT REQUIRED: The element to close. This can either be a string representing the React DOM element to be closed or a React Composite Class (result of calling `React.createClass`) to be closed. This element must match with the last opened React element.

### t(textElement)

Accepts a body of text and will add it as a child of the currently open element.

```javascript
$(el);
  t(text);
y$(el);
```

@param `text` STRING REQUIRED: The body of text to be passed in as child of the open React element.
