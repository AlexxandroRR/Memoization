/**
 * Creates a function that memoizes the result of func. If resolver is provided,
 * it determines the cache key for storing the result based on the arguments provided to the memorized function.
 * By default, the first argument provided to the memorized function is used as the map cache key. The memorized values
 * timeout after the timeout exceeds. The timeout is in defined in milliseconds.
 *
 * Example:
 * function addToTime(year, month, day) {
 *  return Date.now() + Date(year, month, day);
 * }
 *
 * const memoized = memoization.memoize(addToTime, (year, month, day) => year + month + day, 5000)
 *
 * // call the provided function cache the result and return the value
 * const result = memoized(1, 11, 26); // result = 1534252012350
 *
 * // because there was no timeout this call should return the memorized value from the first call
 * const secondResult = memoized(1, 11, 26); // secondResult = 1534252012350
 *
 * // after 5000 ms the value is not valid anymore and the original function should be called again
 * const thirdResult = memoized(1, 11, 26); // thirdResult = 1534252159271
 *
 * @param func      the function for which the return values should be cached
 * @param resolver  if provided gets called for each function call with the exact same set of parameters as the
 *                  original function, the resolver function should provide the memoization key.
 * @param timeout   timeout for cached values in milliseconds
 */

function memoize(func, resolver, timeout) {
    static const items =[];
    var moiValue ="";
    var moiKey = (resolver!=null)?resolver:JSON.stringify(func.arguments);  
    var itemFound=false;
// if key is contained in items and entry is still valid then return value
    foreach(it in items)
        if(it.key == moiKey){  

            if(Date.now()-it.timeStamp < timeout) //the matching item ist still valid
                moiValue=it.value;
            else{
                it.value = func.apply(null, arguments); // the matching item has expired
                it.timeStamp = Date.now();
                moiValue = it.value;
            }
            itemFound=true;
        }
        else{ // cleans up the expired items -- really required? If not we can remove it and we can put a break in the foreach loop as soon as a match hab been found
            if(Date.now()-it.timeStamp > timeout){
                var index = items.indexOf((x)=> ḱey ===moiKey);
                items.slice(index,1);
            }
        }
    if(!itemFound){
        let entry
        {
                    value= func.apply(null, arguments);
                    key =moiKey;
                    timeStamp=Date.now();
        }
        
        items.push(entry);
    }
    
    return moiValue;
}

module.exports = {
    memoize,
};