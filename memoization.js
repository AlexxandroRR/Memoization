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
require("babel-core").transform("code", {
    plugins: ["transform-remove-strict-mode"]
  });

const items =[];
const cleanup_timeout = 1000; // seconds

function memoize(func, resolver, timeout) {
//const memoize = (func, resolver, timeout) =>{
    var moiValue ="";
    var itemFound= false;
    //var args = Array.prototype.slice.call(arguments);
    console.log("resolvervalue=  ", resolver.apply(this, arguments));
    console.log("funcvaluenull=  ", func.apply(null, arguments));
    //console.log("funcarg0=  ", func.arguments[0]);
    //console.log("funcargs=  ", func.arguments);
    //console.log("funcstringify=  ", JSON.stringify(func.JSON.stringify()));
    
    //var moiKey = (resolver.apply(null, arguments)!=null)?resolver.apply(null, arguments):func.args[0];
    var moiKey = resolver?resolver.apply(null, arguments):func.arguments[0];

    console.log("moiKey= ", moiKey);
    if (items.length >0)
    for (i=0; i<items.length; i++){
    //for (it in items){
        console.log("for it ---it.key= ", items[i].key, "moiKey= ", moiKey)
        if(items[i].key == moiKey){  
            if(Date.now()-items[i].timeStamp < timeout/1000) {//here timeout in seconds - the matching item ist still valid
                moiValue=items[i].value;
                console.log("*****Cache*****");
            }
            else{
                items[i].value = func.apply(null, arguments); // the matching item has expired)
                items[i].timeStamp = Date.now();
                moiValue = items[i].value;
            }
            itemFound=true;
            break;
        // Optional:
        // Cleanup elements older that cleanup_timeout (-> remove break)
        // if (Date.now()-items[i].timeStamp>cleanup_timeout) items.slice(i,0);
        }


    }
    if(!itemFound){
        const entry =
        {
                    value: func.apply(this, arguments),
                    key: moiKey,
                    timeStamp: Date.now()
        }
        console.log("ADD ENTRY --- entry.value= ", entry.value, " entyr.key= ", entry.key, " entry.timeStamp= ", entry.timeStamp);
        items.push(entry);
        console.log("Array length =" + items.length);
        moiValue=entry.value;
    }
    
    for (i=0; i<items.length; i++)
    console.log("Id= ", i, " Value= ", items[i].value, " key= ", items[i].key, " timest= ", items[i].timeStamp, "\n");
    
    return moiValue;
}


module.exports = {
    memoize
}

