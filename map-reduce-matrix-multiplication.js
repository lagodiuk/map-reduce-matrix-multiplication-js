function multiplyMatrixesMapReduce(a, b, config) {
    var resultName = config['resultName'] ? config['resultName'] : 'output';
    var separator = config['separator'] ? config['separator'] : ',';

    var map1 = function(row, emit) {
        var parts = row.split(separator);
        var matrixName = parts[0];
        var i = parts[1];
        var j = parts[2];
        if (matrixName == 'A') {
            emit(j, row);
        }
        if (matrixName == 'B') {
            emit(i, row);
        }
    }

    var reduce1 = function(key, values, output) {
        var rowsA = [];
        var rowsB = [];
        for (var i in values) {
            var row = values[i];
            var parts = row.split(separator);
            var matrixName = parts[0];
            if (matrixName == 'A') {
                rowsA.push(row);
            }
            if (matrixName == 'B') {
                rowsB.push(row);
            }
        }

        for (var a in rowsA) {
            var rowA = rowsA[a];
            var partsA = rowA.split(separator);
            var valueA = parseFloat(partsA[3]);

            for (var b in rowsB) {
                var rowB = rowsB[b];
                var partsB = rowB.split(separator);
                var valueB = parseFloat(partsB[3]);

                var valueC = valueA * valueB;
                output.push(resultName + separator + partsA[1] + separator + partsB[2] + separator + valueC)
            }
        }
    }

    var map2 = function(row, emit) {
        var parts = row.split(separator);
        var i = parts[1];
        var j = parts[2];
        var key = i + separator + j;
        emit(key, row);
    }

    var reduce2 = function(key, values, output) {
        var sum = 0;
        for (var i in values) {
            var row = values[i];
            var parts = row.split(separator);
            var value = parseFloat(parts[3]);
            sum += value;
        }
        output.push(resultName + separator + key + separator + sum);
    }

    var input = a.concat(b);

    var output1 = mapReduce(input, map1, reduce1);

    // console.log(JSON.stringify(output1, null, 4));

    var output2 = mapReduce(output1, map2, reduce2);

    // console.log(JSON.stringify(output2, null, 4));

    return output2;
}