function multiplyMatrixesMapReduce(a, b, resultName) {
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
        output.push(resultName + ',' + key + ',' + sum);
    }
    
    var input = a.concat(b);
    
    var output1 = mapReduce(input, map1, reduce1);
    
    // console.log(JSON.stringify(output1, null, 4));
    
    var output2 = mapReduce(output1, map2, reduce2);
    
    // console.log(JSON.stringify(output2, null, 4));

    return output2;
}
