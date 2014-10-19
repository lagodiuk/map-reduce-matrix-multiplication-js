function mapReduce(input, map, reduce) {
    // Map
    var mapperOutput = [].concat.apply(
        [], 
        input.map(function(row) {        
            var emitArray = [];
            var emit = function(key, value) {
                emitArray.push({
                    key: key,
                    value: value
                });
            };
            map(row, emit);
            return emitArray;
        })
    );
    
    // Group tuples with the same key
    var reducerInput = {};
    mapperOutput.forEach(function(keyValue){
        var key = keyValue.key;
        var value = keyValue.value;
        if(!reducerInput[key]) {
            reducerInput[key] = [];
        }
        reducerInput[key].push(value);
    });
    
    // Reduce
    var output = [];
    for(var key in reducerInput) {
        var values = reducerInput[key];
        reduce(key, values, output);
    }
    
    // That's all
    return output;
}