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

var input = [
    "A,0,1,1.0",
    "A,0,2,2.0",
    "A,0,3,3.0",
    "A,0,4,4.0",
    "A,1,0,5.0",
    "A,1,1,6.0",
    "A,1,2,7.0",
    "A,1,3,8.0",
    "A,1,4,9.0",
    "B,0,1,1.0",
    "B,0,2,2.0",
    "B,1,0,3.0",
    "B,1,1,4.0",
    "B,1,2,5.0",
    "B,2,0,6.0",
    "B,2,1,7.0",
    "B,2,2,8.0",
    "B,3,0,9.0",
    "B,3,1,10.0",
    "B,3,2,11.0",
    "B,4,0,12.0",
    "B,4,1,13.0",
    "B,4,2,14.0",
];

var map1 = function(row, emit) {
    var parts = row.split(",");
    var matrixName = parts[0];
    var i = parts[1];
    var j = parts[2];
    if(matrixName == 'A') {
        emit(j, row);
    }
    if(matrixName == 'B') {
        emit(i, row);
    }
}

var reduce1 = function(key, values, output) {
    var rowsA = [];
    var rowsB = [];
    for(var i in values) {
        var row = values[i];
        var parts = row.split(",");
        var matrixName = parts[0];
        if(matrixName == 'A') {
            rowsA.push(row);
        }
        if(matrixName == 'B') {
            rowsB.push(row);
        }
    }
    
    for(var a in rowsA) {
        var rowA = rowsA[a];
        var partsA = rowA.split(",");
        
        for(var b in rowsB) {
            var rowB = rowsB[b];
            var partsB = rowB.split(",");
            
            var valueC = parseFloat(partsA[3]) * parseFloat(partsB[3]);
            output.push('C,' + partsA[1] + ',' + partsB[2] + ',' + valueC)
        }
    }
}

var output1 = mapReduce(input, map1, reduce1);

console.log(JSON.stringify(output1, null, 4));

var map2 = function(row, emit) {
    var parts = row.split(",");
    var i = parts[1];
    var j = parts[2];
    var key = i + ',' + j;
    emit(key, row);
}

var reduce2 = function(key, values, output) {
    var sum = 0;
    for(var i in values) {
        var row = values[i];
        var parts = row.split(",");
        var value = parseFloat(parts[3]);
        sum += value;
    }
    output.push('C,' + key + ',' + sum);
}

var output2 = mapReduce(output1, map2, reduce2);

console.log(JSON.stringify(output2, null, 4));
