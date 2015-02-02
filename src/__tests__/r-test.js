jest.dontMock('../r');

describe('r', function () {
  var r, React, mockProps, mockReturn, mockReactClass;

  beforeEach(function () {
    r = require('../r');
    React = require('react/addons');
    mockReactClass = React.createClass({
      render: function () {
        return React.createElement('div', null);
      }
    });
    React.createElement = jest.genMockFunction();
    mockProps = {};
    mockReturn = {};
  });

  it('should invoke React.createElement with a single element', function () {
    r(function (h, t) {
      h('br /');
    });

    expect(React.createElement.mock.calls[0][0]).toBe('br');
    expect(React.createElement.mock.calls[0][1]).toBe(null);
  });

  it('should invoke React.createElement with an element with text', function () {
    r(function (h, t) {
      h('h1');
        t('hello, world');
      h('/h1');
    });

    expect(React.createElement.mock.calls[0][0]).toBe('h1');
    expect(React.createElement.mock.calls[0][1]).toBe(null);
    expect(React.createElement.mock.calls[0][2]).toBe('hello, world');
  });

  it('should invoke React.createElement with an element with props', function () {
    r(function (h, t) {
      h('div', mockProps, '/');
    });

    expect(React.createElement.mock.calls[0][0]).toBe('div');
    expect(React.createElement.mock.calls[0][1]).toBe(mockProps);
  });

  it('should invoke React.createElement with an element with text and props', function () {
    r(function (h, t) {
      h('p', mockProps);
        t('what cool syntax');
      h('/p');
    });

    expect(React.createElement.mock.calls[0][0]).toBe('p');
    expect(React.createElement.mock.calls[0][1]).toBe(mockProps);
    expect(React.createElement.mock.calls[0][2]).toBe('what cool syntax');
  });

  it('should invoke React.createElement with a custom element', function () {
    r(function (h, t) {
      h(mockReactClass, '/');
    });

    r(function (h, t) {
      h(mockReactClass, mockProps, '/');
    });

    r(function (h, t) {
      h(mockReactClass);
        t('inner child');
      h('/mockReactClass');
    });

    r(function (h, t) {
      h(mockReactClass, mockProps);
        t('inner child');
      h('/mockReactClass');
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
    React.createElement.mockReturnValueOnce(mockReturn);

    r(function (h, t) {
      h('ol');
        h('li', mockProps);
          t('list item');
        h('/li');
      h('/ol');
    });

    expect(React.createElement.mock.calls[0][0]).toBe('li');
    expect(React.createElement.mock.calls[0][1]).toBe(mockProps);
    expect(React.createElement.mock.calls[0][2]).toBe('list item');
    expect(React.createElement.mock.calls[1][0]).toBe('ol');
    expect(React.createElement.mock.calls[1][1]).toBe(null);
    expect(React.createElement.mock.calls[1][2]).toBe(mockReturn);
  });

  it('should invoke React.createElement with a complex element hierarchy', function () {
    React.createElement.mockReturnValue(mockReturn);

    r(function (h, t) {
      h('div');
        t('some text');
        h('ol');
          h('li', mockProps);
            t('list item');
          h('/li');
          h(mockReactClass, mockProps, '/');
        h('/ol');
        h('h1');
          h('span');
            t('some text');
          h('/span');
          h(mockReactClass);
            t('mock text');
          h('/mockReactClass');
        h('/h1');
      h('/div');
    });

    expect(React.createElement.mock.calls[0][0]).toBe('li');
    expect(React.createElement.mock.calls[0][1]).toBe(mockProps);
    expect(React.createElement.mock.calls[0][2]).toBe('list item');

    expect(React.createElement.mock.calls[1][0]).toBe(mockReactClass);
    expect(React.createElement.mock.calls[1][1]).toBe(mockProps);

    expect(React.createElement.mock.calls[2][0]).toBe('ol');
    expect(React.createElement.mock.calls[2][1]).toBe(null);
    expect(React.createElement.mock.calls[2][2]).toBe(mockReturn);
    expect(React.createElement.mock.calls[2][3]).toBe(mockReturn);

    expect(React.createElement.mock.calls[3][0]).toBe('span');
    expect(React.createElement.mock.calls[3][1]).toBe(null);
    expect(React.createElement.mock.calls[3][2]).toBe('some text');

    expect(React.createElement.mock.calls[4][0]).toBe(mockReactClass);
    expect(React.createElement.mock.calls[4][1]).toBe(null);
    expect(React.createElement.mock.calls[4][2]).toBe('mock text');

    expect(React.createElement.mock.calls[5][0]).toBe('h1');
    expect(React.createElement.mock.calls[5][1]).toBe(null);
    expect(React.createElement.mock.calls[5][2]).toBe(mockReturn);
    expect(React.createElement.mock.calls[5][3]).toBe(mockReturn);

    expect(React.createElement.mock.calls[6][0]).toBe('div');
    expect(React.createElement.mock.calls[6][1]).toBe(null);
    expect(React.createElement.mock.calls[6][2]).toBe('some text');
    expect(React.createElement.mock.calls[6][3]).toBe(mockReturn);
    expect(React.createElement.mock.calls[6][4]).toBe(mockReturn);
  });
});
