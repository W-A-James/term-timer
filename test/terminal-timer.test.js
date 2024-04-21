import { TerminalTimer } from '../src/terminal-timer.js';
import { expect } from 'chai';


describe('class TerminalTimer()', function() {
  context('constructor()', function() {
    context('when called multiple times', function() {
      let timer;

      afterEach(() => {
        if (timer) timer.kill();
      });

      it('throws an error', function() {
        timer = new TerminalTimer(100);
        expect(() => new TerminalTimer(100)).to.throw(Error);
      });
    });
  });

  context('run()', function() {
    let timer;

    afterEach(() => {
      if (timer) timer.kill();
    });

    it('creates a Timeout instance', async function() {
      timer = new TerminalTimer(100);
      const preRunActiveResources = process.getActiveResourcesInfo();
      expect(preRunActiveResources).to.not.include('Timeout');
      timer.run();

      const midRunActiveResources = process.getActiveResourcesInfo();
      expect(midRunActiveResources).to.include('Timeout');
    });
  });

  context('kill()', function() {
    it('kills all timers associated with TerminalTimer instance', async function() {
      const timer = new TerminalTimer(100);

      const preRunActiveResources = process.getActiveResourcesInfo();
      expect(preRunActiveResources).to.not.include('Timeout');

      timer.run();

      const midRunActiveResources = process.getActiveResourcesInfo();
      expect(midRunActiveResources).to.include('Timeout');

      timer.kill();

      const postKillActiveResources = process.getActiveResourcesInfo();
      expect(postKillActiveResources).to.not.include('Timeout');
    });
  });
});
