jest.dontMock('../r');

describe('r', function () {
  var r, React, mockProps;
  beforeEach(function () {
    r = require('../r');
    React = require('react/addons');
    React.createElement = jest.genMockFunction();
    mockProps = {};
  });

  it('should properly invoke React.createElement when rendering a single tag', function () {
    r('br');
    expect(React.createElement.mock.calls[0][0]).toBe('br');
    expect(React.createElement.mock.calls[0][1]).toBe(null);
  });

  it('should handle self closing tags with our without spaces when rendering a single tag', function () {
    r('br/');
    expect(React.createElement.mock.calls[0][0]).toBe('br');
    expect(React.createElement.mock.calls[0][1]).toBe(null);
    r('br /');
    expect(React.createElement.mock.calls[1][0]).toBe('br');
    expect(React.createElement.mock.calls[1][1]).toBe(null);
  });

  it('should allow a tag to render with text as its only child', function () {
    r('h1', 'hello, world');
    expect(React.createElement.mock.calls[0][0]).toBe('h1');
    expect(React.createElement.mock.calls[0][1]).toBe(null);
    expect(React.createElement.mock.calls[0][2]).toBe('hello, world');
  });

  it('should allow a tag to render with only props', function () {
    r('div', mockProps);
    expect(React.createElement.mock.calls[0][0]).toBe('div');
    expect(React.createElement.mock.calls[0][1]).toBe(mockProps);
  });
});
