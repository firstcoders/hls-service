import parseCsv from '../../src/libs/parseCsv';

describe('parseCsv', () => {
  describe('when given a csv with strings and numbers', () => {
    it('returns an array with strings and numbers', () => {
      const result = parseCsv('a,2,c');

      expect(result.length).toBe(3);
      expect(result[0]).toBe('a');
      expect(result[1]).toBe(2);
      expect(result[2]).toBe('c');
    });
  });
});
