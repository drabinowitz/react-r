jest.dontMock('../r');

describe('r', function () {
  var r, React;
  beforeEach(function () {
    r = require('../r');
    React = require('react/addons');
    React.createElement = jest.genMockFunction();
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
});
