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
    var outputArray = [];
    var output = function(resultRow) {
        outputArray.push(resultRow);
    }
    for(var key in reducerInput) {
        var values = reducerInput[key];
        reduce(key, values, output);
    }
    
    // That's all
    return outputArray;
}

function multiplyMatrixesMapReduce(a, b, config) {
    var leftMatrix = config['leftMatrix'] ? config['leftMatrix'] : 'A';
    var rightMatrix = config['rightMatrix'] ? config['rightMatrix'] : 'B';    
    var resultName = config['resultName'] ? config['resultName'] : 'output';
    var separator = config['separator'] ? config['separator'] : ',';

    var map1 = function(row, emit) {
        var parts = row.split(separator);
        var matrixName = parts[0];
        var i = parts[1];
        var j = parts[2];
        if (matrixName == leftMatrix) {
            emit(j, row);
        }
        if (matrixName == rightMatrix) {
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
            if (matrixName == leftMatrix) {
                rowsA.push(row);
            }
            if (matrixName == rightMatrix) {
                rowsB.push(row);
            }
        }

        for (var a in rowsA) {
            var rowA = rowsA[a];
            var partsA = rowA.split(separator);
            var valueA = parseFloat(partsA[3]);
            var i = partsA[1];

            for (var b in rowsB) {
                var rowB = rowsB[b];
                var partsB = rowB.split(separator);
                var valueB = parseFloat(partsB[3]);
                var j = partsB[2];

                var valueC = valueA * valueB;
                output(resultName + separator + i + separator + j + separator + valueC)
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
        output(resultName + separator + key + separator + sum);
    }

    var input = a.concat(b);

    var output1 = mapReduce(input, map1, reduce1);

    // console.log(JSON.stringify(output1, null, 4));

    var output2 = mapReduce(output1, map2, reduce2);

    // console.log(JSON.stringify(output2, null, 4));

    return output2;
}

function pageRank(pagesCount, links, notTeleportProbability) {
    function prepare(input) {
        function map(row, emit) {
            var parts = row.split('->');
            var src = parts[0].trim();
            var dests = parts[1].trim();
            var destParts = dests.split(' ');
            var transitionProbability = 1.0 / destParts.length;
            for(var i in destParts) {
                emit(destParts[i] + ',' + src, transitionProbability);
            }
        }
        
        function reduce(key, values, output) {
            var sum = 0;
            for(var i in values) {
                sum += values[i];
            }
            output('M,' + key + ',' + sum);
        }
        
        return mapReduce(input, map, reduce);
    }
    
    // TODO
    function intializePageRanks(pagesCount) {
        var initialPageRank = [];
        var initialValue = 1.0 / pagesCount;
        for(var i = 0; i < pagesCount; i++) {
            initialPageRank.push('R,' + i + ',0,' + initialValue);
        }
        return initialPageRank;
    }
    
    // TODO
    function normalize(pageRankVector, notTeleportProbability) {
        var sum = 0;
        var tmp = new Array(pagesCount);
        for(var i = 0; i < pagesCount; i++) {
            tmp[i] = 0;
        }
        for(var i in pageRankVector) {
            var row = pageRankVector[i];
            var parts = row.split(',');
            var value = parseFloat(parts[3]) * notTeleportProbability;
            sum += value;
            tmp[parseInt(parts[1])] = value;
        }
        var additional = (1.0 - sum) / pagesCount;
        for(var i = 0; i < pagesCount; i++) {
            tmp[i] += additional;
        }
        var result = [];
        for(var i = 0; i < pagesCount; i++) {
            result.push('R,' + i + ',0,' + tmp[i]);
        }
        return result;
    }
    
    var transitionMatrix = prepare(links);

    console.log(JSON.stringify(transitionMatrix, null, 4));
    
    var pageRankVector = intializePageRanks(3);
    
    console.log(JSON.stringify(pageRankVector, null, 4));
    
    for(var i = 0; i < 10; i++) {
        var config = {
            leftMatrix: 'M',
            rightMatrix: 'R',
            separator: ',',
            resultName: 'R'
        };
        
        pageRankVector = multiplyMatrixesMapReduce(transitionMatrix, pageRankVector, config);
        
        //console.log(JSON.stringify(pageRankVector, null, 4));
        
        pageRankVector = normalize(pageRankVector, notTeleportProbability);
        
        console.log(JSON.stringify(pageRankVector, null, 4));
    }
}

var pagesCount = 3;
var notTeleportProbability = 0.7;
var links = [
    "0 -> 1 2",
    "1 -> 2",
    "2 -> 2"
];

pageRank(pagesCount, links, notTeleportProbability);