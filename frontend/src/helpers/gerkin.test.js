import { getGerkinLines } from './gerkin';

describe('Gerkin', () => {
  it('needs a keyword to start', () => {
    expect(getGerkinLines('hello world')).toEqual(null);
  });

  it('can have whitespace before', () => {
    expect(getGerkinLines('\ngiven world')).toEqual([
      { keyword: 'given', text: 'world' },
    ]);
  });

  it('starts lines with keywords', () => {
    expect(getGerkinLines('given hello\n world\nwhen goodbye')).toEqual([
      {
        keyword: 'given',
        text: 'hello world',
      },
      { keyword: 'when', text: 'goodbye' },
    ]);
  });
});
