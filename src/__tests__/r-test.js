jest.dontMock('../r');

describe('r', function () {
  var r, React, mockProps, mockReactClass, mockReactElement;

  beforeEach(function () {
    r = require('../r');
    React = require('react/addons');
    mockReactClass = React.createClass({
      render: function () {
        return React.createElement('div', null);
      }
    });
    mockReactElement = React.createElement(mockReactClass, null);
    React.createElement = jest.genMockFunction();
    mockProps = {};
  });

  it('should invoke and return React.createElement with a single element', function () {
    React.createElement.mockReturnValue(mockReactElement);
    var result = r(function ($, y$, t) {
      $('br', y$);
    });

    expect(React.createElement.mock.calls[0][0]).toBe('br');
    expect(React.createElement.mock.calls[0][1]).toBe(null);
    expect(result).toBe(mockReactElement);
  });

  it('should invoke React.createElement with an element with no children', function () {
    React.createElement.mockReturnValue(mockReactElement);
    var result = r(function ($, y$, t) {
      $('h1');
      y$('h1');
    });

    expect(React.createElement.mock.calls[0][0]).toBe('h1');
    expect(React.createElement.mock.calls[0][1]).toBe(null);
    expect(result).toBe(mockReactElement);
  });

  it('should invoke React.createElement with an element with text', function () {
    React.createElement.mockReturnValue(mockReactElement);
    var result = r(function ($, y$, t) {
      $('h1');
        t('hello, world');
      y$('h1');
    });

    expect(React.createElement.mock.calls[0][0]).toBe('h1');
    expect(React.createElement.mock.calls[0][1]).toBe(null);
    expect(React.createElement.mock.calls[0][2]).toBe('hello, world');
    expect(result).toBe(mockReactElement);
  });

  it('should invoke React.createElement with an element with props', function () {
    React.createElement.mockReturnValue(mockReactElement);
    var result = r(function ($, y$, t) {
      $('div', mockProps, y$);
    });

    expect(React.createElement.mock.calls[0][0]).toBe('div');
    expect(React.createElement.mock.calls[0][1]).toBe(mockProps);
    expect(result).toBe(mockReactElement);
  });

  it('should invoke React.createElement with an element with text and props', function () {
    React.createElement.mockReturnValue(mockReactElement);
    var result = r(function ($, y$, t) {
      $('p', mockProps);
        t('what cool syntax');
      y$('p');
    });

    expect(React.createElement.mock.calls[0][0]).toBe('p');
    expect(React.createElement.mock.calls[0][1]).toBe(mockProps);
    expect(React.createElement.mock.calls[0][2]).toBe('what cool syntax');
    expect(result).toBe(mockReactElement);
  });

  it('should invoke React.createElement with a custom element', function () {
    React.createElement.mockReturnValue(mockReactElement);
    var result = r(function ($, y$, t) {
      $(mockReactClass, y$);
    });
    expect(result).toBe(mockReactElement);

    r(function ($, y$, t) {
      $(mockReactClass, mockProps, y$);
    });

    r(function ($, y$, t) {
      $(mockReactClass);
        t('inner child');
      y$(mockReactClass);
    });

    r(function ($, y$, t) {
      $(mockReactClass, mockProps);
        t('inner child');
      y$(mockReactClass);
    });

    expect(React.createElement.mock.calls[0][0]).toBe(mockReactClass);
    expect(React.createElement.mock.calls[0][1]).toBe(null);

    expect(React.createElement.mock.calls[1][0]).toBe(mockReactClass);
    expect(React.createElement.mock.calls[1][1]).toBe(mockProps);

    expect(React.createElement.mock.calls[2][0]).toBe(mockReactClass);
    expect(React.createElement.mock.calls[2][1]).toBe(null);
    expect(React.createElement.mock.calls[2][2]).toBe('inner child');

    expect(React.createElement.mock.calls[3][0]).toBe(mockReactClass);
    expect(React.createElement.mock.calls[3][1]).toBe(mockProps);
    expect(React.createElement.mock.calls[3][2]).toBe('inner child');
  });

  it('should invoke React.createElement with an element with a child element', function () {
    React.createElement.mockReturnValueOnce(mockReactElement);

    r(function ($, y$, t) {
      $('ol');
        $('li', mockProps);
          t('list item');
        y$('li');
      y$('ol');
    });

    expect(React.createElement.mock.calls[0][0]).toBe('li');
    expect(React.createElement.mock.calls[0][1]).toBe(mockProps);
    expect(React.createElement.mock.calls[0][2]).toBe('list item');
    expect(React.createElement.mock.calls[1][0]).toBe('ol');
    expect(React.createElement.mock.calls[1][1]).toBe(null);
    expect(React.createElement.mock.calls[1][2]).toBe(mockReactElement);
  });

  it('should invoke React.createElement with a complex element hierarchy', function () {
    React.createElement.mockReturnValue(mockReactElement);

    r(function ($, y$, t) {
      $('div');
        t('some text');
        $('ol');
          $('li', mockProps);
            t('list item');
          y$('li');
          $(mockReactClass, mockProps, y$);
        y$('ol');
        $('h1');
          $('span');
            t('some text');
          y$('span');
          $(mockReactClass);
            t('mock text');
          y$(mockReactClass);
        y$('h1');
      y$('div');
    });

    expect(React.createElement.mock.calls[0][0]).toBe('li');
    expect(React.createElement.mock.calls[0][1]).toBe(mockProps);
    expect(React.createElement.mock.calls[0][2]).toBe('list item');

    expect(React.createElement.mock.calls[1][0]).toBe(mockReactClass);
    expect(React.createElement.mock.calls[1][1]).toBe(mockProps);

    expect(React.createElement.mock.calls[2][0]).toBe('ol');
    expect(React.createElement.mock.calls[2][1]).toBe(null);
    expect(React.createElement.mock.calls[2][2]).toBe(mockReactElement);
    expect(React.createElement.mock.calls[2][3]).toBe(mockReactElement);

    expect(React.createElement.mock.calls[3][0]).toBe('span');
    expect(React.createElement.mock.calls[3][1]).toBe(null);
    expect(React.createElement.mock.calls[3][2]).toBe('some text');

    expect(React.createElement.mock.calls[4][0]).toBe(mockReactClass);
    expect(React.createElement.mock.calls[4][1]).toBe(null);
    expect(React.createElement.mock.calls[4][2]).toBe('mock text');

    expect(React.createElement.mock.calls[5][0]).toBe('h1');
    expect(React.createElement.mock.calls[5][1]).toBe(null);
    expect(React.createElement.mock.calls[5][2]).toBe(mockReactElement);
    expect(React.createElement.mock.calls[5][3]).toBe(mockReactElement);

    expect(React.createElement.mock.calls[6][0]).toBe('div');
    expect(React.createElement.mock.calls[6][1]).toBe(null);
    expect(React.createElement.mock.calls[6][2]).toBe('some text');
    expect(React.createElement.mock.calls[6][3]).toBe(mockReactElement);
    expect(React.createElement.mock.calls[6][4]).toBe(mockReactElement);
  });

  it('should accept reactElements and submit them as self closing elements', function () {

    r(function ($, y$, t) {
      $('div', mockProps);
        $(mockReactElement);
        t('some text');
      y$('div');
    });

    expect(React.createElement.mock.calls[0][0]).toBe('div');
    expect(React.createElement.mock.calls[0][1]).toBe(mockProps);
    expect(React.createElement.mock.calls[0][2]).toBe(mockReactElement);
    expect(React.createElement.mock.calls[0][3]).toBe('some text');
  });

  it('should accept arrays of reactElements and submit them as self closing arrays of elements', function () {
    var mockElementArray = [mockReactElement, mockReactElement];

    r(function ($, y$, t) {
      $('div', mockProps);
        $(mockElementArray);
        t('some text');
      y$('div');
    });

    expect(React.createElement.mock.calls[0][0]).toBe('div');
    expect(React.createElement.mock.calls[0][1]).toBe(mockProps);
    expect(React.createElement.mock.calls[0][2]).toBe(mockElementArray);
    expect(React.createElement.mock.calls[0][3]).toBe('some text');
  });

  it('should throw an error if composition does not have enough closing tags', function () {
    expect(function () {
      r(function ($, y$, t) {
        $('div');
      });
    }).toThrow(new Error('Invariant Violation: there are not enough closing tags for this render composition'));

    expect(function () {
      r(function ($, y$, t) {
        $('div');
          $('h1');
            t('text');
          y$('h1');
      });
    }).toThrow(new Error('Invariant Violation: there are not enough closing tags for this render composition'));
  });

  it('should throw an error if composition has too many closing tags', function () {
    expect(function () {
      r(function ($, y$, t) {
        $('h3', y$);
        y$('h3');
      });
    }).toThrow(new Error('Invariant Violation: there are too many closing tags for this render composition: "h3"'));

    expect(function () {
      r(function ($, y$, t) {
        $('h3');
          $('div', y$);
        y$('h3');
        y$('h3');
      });
    }).toThrow(new Error('Invariant Violation: there are too many closing tags for this render composition: "h3"'));
  });

  it('should throw an error if composition has mismatched tags', function () {
    expect(function () {
      r(function ($, y$, t) {
        $('div');
          $('h1');
          y$('h2');
        y$('div');
      });
    }).toThrow(new Error('Invariant Violation: the opening tag: "h1" does not match with the closing tag: "h2"'));

    expect(function () {
      r(function ($, y$, t) {
        $('h1');
          $('h1', y$);
        y$('h2');
      });
    }).toThrow(new Error('Invariant Violation: the opening tag: "h1" does not match with the closing tag: "h2"'));
  });

  it('should throw an error if there are multiple outermost tags', function () {
    expect(function () {
      r(function ($, y$, t) {
        $('div');
          t('some text');
        y$('div');
        $('div');
          t('some text');
        y$('div');
      });
    }).toThrow(new Error('Invariant Violation: there are multiple outermost tags. r needs to return a single outermost tag same as with the normal React class render method return'));
  });
});
