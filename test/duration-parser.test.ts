import { parseDuration } from '../src/duration-parser.js';
import { expect } from 'chai';

describe('parseDuration()', () => {
  context('when passed a string of the format <x>h <y>m <z>s', function() {
    it('correctly calculates the number of seconds', function() {
      expect(parseDuration('1h 10m 45s')).to.equal(3600 * 1 + 60 * 10 + 45);
    });
  });

  context('when passed a string of the format <x>h <y>m', function() {
    it('correctly calculates the number of seconds', function() {
      expect(parseDuration('10h 45m')).to.equal(3600 * 10 + 45 * 60);
    });
  });

  context('when passed a string of the format <x>h <y>s', function() {
    it('correctly calculates the number of seconds', function() {
      expect(parseDuration('10h 45s')).to.equal(3600 * 10 + 45);
    });
  });

  context('when passed a string of the format <x>m <y>s', function() {
    it('correctly calculates the number of seconds', function() {
      expect(parseDuration('10m 40s')).to.equal(60 * 10 + 40);
    });
  });
  context('when passed a string of the format <x>m', function() {
    it('correctly calculates the number of seconds', function() {
      expect(parseDuration('10m')).to.equal(60 * 10);
    });
  });

  context('when passed a string of the format <x>s', function() {
    it('correctly calculates the number of seconds', function() {
      expect(parseDuration('10s')).to.equal(10);
    });
  });

  context('when passed a string of the format <x>', function() {
    it('correctly calculates the number of seconds', function() {
      expect(parseDuration('10')).to.equal(10);
    });
  });

  context('when passed an unrecognized time specifier', function() {
    it('throws an error', function() {
      expect(() => parseDuration('10a')).to.throw(Error).matches(/Unrecognized time specifier/);
    });
  });

  context('when passed duplicate hour specifiers', function() {
    it('throws an error', function() {
      expect(() => parseDuration('1h 1h')).to.throw(Error).matches(/duplicate hours specifier/);
    });
  });

  context('when passed duplicate minute specifiers', function() {
    it('throws an error', function() {
      expect(() => parseDuration('1m 1m')).to.throw(Error).matches(/duplicate minutes specifier/);
    });
  });

  context('when passed duplicate second specifiers', function() {
    it('throws an error', function() {
      expect(() => parseDuration('1s 1s')).to.throw(Error).matches(/duplicate seconds specifier/);
    });
  });
});
