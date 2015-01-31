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
    r.compose(
      r('br /')
    );

    expect(React.createElement.mock.calls[0][0]).toBe('br');
    expect(React.createElement.mock.calls[0][1]).toBe(null);
  });

  it('should invoke React.createElement with an element with text', function () {
    r.compose(
      r('h1'), 'hello, world', r('/h1')
    );

    expect(React.createElement.mock.calls[0][0]).toBe('h1');
    expect(React.createElement.mock.calls[0][1]).toBe(null);
    expect(React.createElement.mock.calls[0][2]).toBe('hello, world');
  });

  it('should invoke React.createElement with an element with props', function () {
    r.compose(
      r('div', mockProps, '/')
    );

    expect(React.createElement.mock.calls[0][0]).toBe('div');
    expect(React.createElement.mock.calls[0][1]).toBe(mockProps);
  });

  it('should invoke React.createElement with an element with text and props', function () {
    r.compose(
      r('p', mockProps), 'what cool syntax', r('/p')
    );

    expect(React.createElement.mock.calls[0][0]).toBe('p');
    expect(React.createElement.mock.calls[0][1]).toBe(mockProps);
    expect(React.createElement.mock.calls[0][2]).toBe('what cool syntax');
  });

  it('should invoke React.createElement with a custom element', function () {
    r.compose(
      r(mockReactClass, '/')
    );
    r.compose(
      r(mockReactClass, mockProps, '/')
    );
    r.compose(
      r(mockReactClass), 'inner child', r('/mockReactClass')
    );
    r.compose(
      r(mockReactClass, mockProps), 'inner child', r('/mockReactClass')
    );

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

    r.compose(
      r('ol'),
        r('li', mockProps),'list item', r('/li'),
      r('/ol')
    );

    expect(React.createElement.mock.calls[0][0]).toBe('li');
    expect(React.createElement.mock.calls[0][1]).toBe(mockProps);
    expect(React.createElement.mock.calls[0][2]).toBe('list item');
    expect(React.createElement.mock.calls[1][0]).toBe('ol');
    expect(React.createElement.mock.calls[1][1]).toBe(null);
    expect(React.createElement.mock.calls[1][2]).toBe(mockReturn);
  });

  it('should invoke React.createElement with a complex element hierarchy', function () {
    React.createElement.mockReturnValue(mockReturn);

    r.compose(
      r('div'),
        'some text',
        r('ol'),
          r('li', mockProps), 'list item', r('/li'),
          r(mockReactClass, mockProps, '/'),
        r('/ol'),
        r('h1'), r('span'), 'some text', r('/span'), r('/h1'),
      r('/div')
    );

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

    expect(React.createElement.mock.calls[4][0]).toBe('h1');
    expect(React.createElement.mock.calls[4][1]).toBe(null);
    expect(React.createElement.mock.calls[4][2]).toBe(mockReturn);

    expect(React.createElement.mock.calls[5][0]).toBe('div');
    expect(React.createElement.mock.calls[5][1]).toBe(null);
    expect(React.createElement.mock.calls[5][2]).toBe('some text');
    expect(React.createElement.mock.calls[5][3]).toBe(mockReturn);
    expect(React.createElement.mock.calls[5][4]).toBe(mockReturn);
  });
});
