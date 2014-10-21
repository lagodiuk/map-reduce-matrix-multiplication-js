function pageRank(pagesCount, links, notTeleportProbability, iterations) {
    
    var transitionMatrixName = 'M';
    var pageRankVectorName = 'R';
    var separator = ',';
    var inputSeparator = '->';
    var inputSeparator2 = ' ';
    var pageRanksSum = 1.0;
    
    /**
     * Input: array of strings, like "0 -> 1 2" 
     * (page with id = 0 has links to pages with ids: 1 and 2)
     * So, probability to "surf" to pages 1 or 2 from page 0 is 0.5
     * Input string "0 -> 1 2"  will be transformed into two strings:
     * "M,0,1,0.5"
     * "M,0,2,0.5"
     */
    function prepare(input) {
        function map(row, emit) {
            var parts = row.split(inputSeparator);
            var src = parts[0].trim();
            var dests = parts[1].trim();
            var destParts = dests.split(inputSeparator2);
            var transitionProbability = 1.0 / destParts.length;
            for(var i in destParts) {
                emit(destParts[i] + separator + src, transitionProbability);
            }
        }
        
        function reduce(key, values, output) {
            var sum = 0;
            for(var i in values) {
                sum += values[i];
            }
            output(transitionMatrixName + separator + key + separator + sum);
        }
        
        return mapReduce(input, map, reduce);
    }
    
    // TODO MapReduce
    function intializePageRanks(pagesCount) {
        var initialPageRank = [];
        var initialValue = pageRanksSum / pagesCount;
        for(var i = 0; i < pagesCount; i++) {
            initialPageRank.push(pageRankVectorName + separator + i + separator + '0' + separator + initialValue);
        }
        return initialPageRank;
    }
    
    // TODO MapReduce
    function normalize(pageRankVector, notTeleportProbability) {
        var sum = 0;
        var tmp = new Array(pagesCount);
        for(var i = 0; i < pagesCount; i++) {
            tmp[i] = 0;
        }
        for(var i in pageRankVector) {
            var row = pageRankVector[i];
            var parts = row.split(separator);
            var value = parseFloat(parts[3]) * notTeleportProbability;
            sum += value;
            tmp[parseInt(parts[1])] = value;
        }
        var additional = (pageRanksSum - sum) / pagesCount;
        for(var i = 0; i < pagesCount; i++) {
            tmp[i] += additional;
        }
        var result = [];
        for(var i = 0; i < pagesCount; i++) {
            result.push(pageRankVectorName + separator + i + separator + '0' + separator + tmp[i]);
        }
        return result;
    }
    
    var transitionMatrix = prepare(links);

    console.log(JSON.stringify(transitionMatrix, null, 4));
    
    var pageRankVector = intializePageRanks(pagesCount);
    
    console.log(JSON.stringify(pageRankVector, null, 4));

    var multiplicationConfig = {
        leftMatrix: transitionMatrixName,
        rightMatrix: pageRankVectorName,
        separator: separator,
        resultName: pageRankVectorName
    };
    
    for(var i = 0; i < iterations; i++) {
        
        pageRankVector = 
            multiplyMatrixesMapReduce(transitionMatrix, pageRankVector, multiplicationConfig);
        
        pageRankVector =
            normalize(pageRankVector, notTeleportProbability);
        
        console.log(JSON.stringify(pageRankVector, null, 4));
    }
}

function demo_page_rank() {
    
    var notTeleportProbability = 0.7;
    var pagesCount = 3;
    var links = [
                 "0 -> 1 2",
                 "1 -> 2",
                 "2 -> 2",
                 ];
    
    pageRank(pagesCount, links, notTeleportProbability, 10);
}