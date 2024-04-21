import { TerminalTimer } from '../src/terminal-timer.js';
import { expect } from 'chai';


describe('class TerminalTimer()', function() {
  context('constructor()', function() {
    context('when called multiple times', function() {
      let timer: TerminalTimer;

      afterEach(() => {
        if (timer) timer.kill();
      });

      it('throws an error', function() {
        timer = new TerminalTimer(100, false);
        expect(() => new TerminalTimer(100, false)).to.throw(Error);
      });
    });
  });

  context('run()', function() {
    let timer: TerminalTimer;

    afterEach(() => {
      if (timer) timer.kill();
    });

    it('creates a Timeout instance', async function() {
      timer = new TerminalTimer(100, false);
      // @ts-expect-error accessing internals
      const preRunActiveResources = process.getActiveResourcesInfo();
      expect(preRunActiveResources).to.not.include('Timeout');
      timer.run();

      // @ts-expect-error accessing internals
      const midRunActiveResources = process.getActiveResourcesInfo();
      expect(midRunActiveResources).to.include('Timeout');
    });
  });

  context('kill()', function() {
    it('kills all timers associated with TerminalTimer instance', async function() {
      const timer = new TerminalTimer(100, false);

      // @ts-expect-error accessing internals
      const preRunActiveResources = process.getActiveResourcesInfo();
      expect(preRunActiveResources).to.not.include('Timeout');

      timer.run();

      // @ts-expect-error accessing internals
      const midRunActiveResources = process.getActiveResourcesInfo();
      expect(midRunActiveResources).to.include('Timeout');

      timer.kill();

      // @ts-expect-error accessing internals
      const postKillActiveResources = process.getActiveResourcesInfo();
      expect(postKillActiveResources).to.not.include('Timeout');
    });
  });
});
