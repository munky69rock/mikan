import { should } from 'chai';
import { describe, it } from 'mocha';
import strings from '../../lib/strings.js';

should();

describe('strings', () => {
  it('should be formatted', () => {
    strings.hdoc(`
    this
      is
        heredoc.
    `).should.equal(
      'this\n' +
      '  is\n' +
      '    heredoc.\n'
    );
  });

  it('should be empty string', () => {
    strings.hdoc('').should.equal('');
  });

  it('should be worked', () => {
    strings.hdoc(`


    `).should.equal('\n\n');
  });
});
