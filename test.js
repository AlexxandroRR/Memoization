const { memoize } = require('./memoization');
const memoization = require('./memoization');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const sinon = require('sinon');

//var clock = sinon.useFakeTimers();
var FakeTimers = require("@sinonjs/fake-timers");
var clock = FakeTimers.install();

// hint: use https://sinonjs.org/releases/v6.1.5/fake-timers/ for faking timeouts
let returnValue = "";
const testFunction = (key) => returnValue;
const testFunction3Params = (hun, dec, un) => (hun*100+dec*10+un+returnValue);
//const memoized=(key)=> memoization.memoize(testFunction, testResolver, 1000);
const memoized=(key)=> memoization.memoize(testFunction, () => key, 2000); // Timeout in ms
const memoized_zero=(key)=> memoization.memoize(testFunction, () => key, 0);
const memoized_negative=(key)=> memoization.memoize(testFunction, () => key, -1000);
const memoized3p=(hun, dec, un)=> memoization.memoize(testFunction3Params, () => (hun*100+dec*10+un),2000);

describe('memoization test 1', function () {
    it('should memoize function result', () => {
        returnValue = 5;
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
        returnValue=10;
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5); // Cached value
        clock.tick(2); //sinonjs synch timer - in seconds
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(10); // Fresh calculated value after the timer has expired        
    });
});
describe('memoization test 2', function () {
    it('should memoize function result - different key types', () => {
        returnValue = 11;      
        expect(memoized('xxx')).to.equal(11); // Fresh calculated since has a different key
        returnValue = 12;  
        expect(memoized('www')).to.equal(12); 
        returnValue = 13;  
        expect(memoized(true)).to.equal(13); 
        returnValue = 14; 
        expect(memoized(42)).to.equal(14); 

        returnValue=15;
        expect(memoized('xxx')).to.equal(11); // Cached values
        expect(memoized('www')).to.equal(12);
        expect(memoized(true)).to.equal(13); 
        expect(memoized(42)).to.equal(14); 
        clock.tick(2); //sinonjs synch timer - in seconds
        expect(memoized('xxx')).to.equal(15); // Fresh calculated since time is over
        expect(memoized('www')).to.equal(15); 
        expect(memoized(true)).to.equal(15); 
        expect(memoized(42)).to.equal(15);
        
    }); 
});
    describe('memoization test 3', function () {
        it('should memoize function result - zero and neg timers', () => {

            returnValue=16
            expect(memoized('ABC')).to.equal(16); // Fresh calculated 
            returnValue=17
            expect(memoized_zero('ABC')).to.equal(17); // Fresh calculated due to zero timer
    
            returnValue=18
            expect(memoized_negative('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(18); // Fresh caclculated due to negative timer
 
        });
    describe('memoization test 4', function () {
        it('should memoize function result - timer boundary', () => {
            returnValue=21;
            expect(memoized('QQQ')).to.equal(21); // Fresh value
            returnValue=22;
            clock.tick(1); //sinonjs synch timer
            expect(memoized('QQQ')).to.equal(21); // Cached value
            clock.tick(1); //sinonjs synch timer
            expect(memoized('QQQ')).to.equal(22); // Fresh calculated value after the timer has expired        
        });
    });

    describe('memoization test 5', function () {
        it('should memoize function result - function wih more args', () => {
            returnValue = 1;
            expect(memoized3p(0,5,11)).to.equal(62); // Fresh value
            returnValue = 2;
            expect(memoized3p(0,5,11)).to.equal(62); // Cached
            clock.tick(2);
            expect(memoized3p(0,5,11)).to.equal(63); // Fresh value due to time over
                
        });
    });
    
  
        // it should also work with other types than strings, if there are limitations to which types are possible please state them
        // --> Strings, bool, numbers should be OK as key. With structured types it would be difficult to write a generic memoize function which compares their values
        
        //
});