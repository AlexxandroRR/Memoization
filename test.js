const { memoize } = require('./memoization');
const memoization = require('./memoization');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const sinon = require('sinon');

//var clock = sinon.useFakeTimers();
var FakeTimers = require("@sinonjs/fake-timers");
var clock = FakeTimers.install();

// hint: use https://sinonjs.org/releases/v6.1.5/fake-timers/ for faking timeouts


describe('memoization', function () {
    it('should memoize function result', () => {
        let returnValue = 5;
        const testResolver = (key) => key;
        const testFunction = (key) => returnValue;
        
        //const memoized=(key)=> memoization.memoize(testFunction, (key) => key, 1000);
        const memoized=(key)=> memoization.memoize(testFunction, testResolver, 1000);
        const memoized_zero=(key)=> memoization.memoize(testFunction, testResolver, 0);
        const memoized_negative=(key)=> memoization.memoize(testFunction, testResolver, -1000);

        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
        returnValue=10;
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5); // Cached value
        expect(memoized('xxx')).to.equal(10); // Fresh calculated since has a different key
        returnValue=12;
        expect(memoized('xxx')).to.equal(10); // Cached value
        clock.tick(2000); //sinonjs synch timer
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(12); // Fresh calculated value after the timer has expired

        returnValue=15
        expect(memoized_zero('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(15); // Fresh calculated due to zero timer
        returnValue=20
        expect(memoized_negative('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(20); // Fresh caclculated due to negative timer
        
                     
        // TODO currently fails, should work after implementing the memoize function, it should also work with other
        // types than strings, if there are limitations to which types are possible please state them

        // --> Strings, bool, numbers should be OK as key. With structured types it would be difficult to write a generic memoize function which compares their values
        
    });

    // TODO additional tests required
});