function trainNaiveBayes(input) {
    
    // Without smoothing
    
    var CLASS_DELIMITER = "->";
    var WORDS_DELIMITER = " ";
    var COMPLEX_KEY_DELIMITER = " ";
    var COMPLEX_KEY_COUNT_DELIMITER = "->";
    var WORD_COUNT_DELIMITER = "->";
    
    function map1(row, emit) {
        var parts = row.split(CLASS_DELIMITER);
        var clazz = parts[0].trim();
        var words = parts[1].trim().split(WORDS_DELIMITER);
        
        for(var i in words) {
            var word = words[i].trim();
            var key = word + COMPLEX_KEY_DELIMITER + clazz;
            emit(key, 1);
        }
    }
    
    function reduce1(key, values, output) {
        var count = 0;
        for(var i in values) {
            count += values[i];
        }
        output(key + COMPLEX_KEY_COUNT_DELIMITER + count)
    }

    function map2(row, emit) {
        var parts = row.split(COMPLEX_KEY_COUNT_DELIMITER);
        var key = parts[0];        
        var count = parts[1];        
        var keyParts = key.split(COMPLEX_KEY_DELIMITER);
        var word = keyParts[0];
        var clazz = keyParts[1];
        emit(clazz, word + WORD_COUNT_DELIMITER + count);
    }
    
    function reduce2(key, values, output) {
        var clazz = key;
        var totalWordsCount = 0;
        for(var i in values) {
            var wordCount = values[i];
            var wordCountParts = wordCount.split(WORD_COUNT_DELIMITER);
            var count = parseInt(wordCountParts[1]);
            totalWordsCount += count;
        }
        for(var i in values) {
            var wordCount = values[i];
            var wordCountParts = wordCount.split(WORD_COUNT_DELIMITER);
            var word = wordCountParts[0];
            var count = parseInt(wordCountParts[1]);
            output("P(" + word + "|" + clazz + ") = " + count + "/" + totalWordsCount);
        }
    }
    
    return mapReduce(mapReduce(input, map1, reduce1), map2, reduce2);
}

function demo() {
    // Example taken from book:
    // "Introduction to information retrieval"
    var documents = [
        "China -> Chinese Beijing Chinese",
        "China -> Chinese Chinese Shanghai",
        "China -> Chinese Makao",
        "NotChina -> Tokia Japan Chinese",    
    ];
        
    console.log(JSON.stringify(trainNaiveBayes(documents), null, 4));
}
