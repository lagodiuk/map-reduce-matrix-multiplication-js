function wc(input) {
    function map(row, emit) {
        var words = row.split(' ');
        for(var i in words) {
            var word = words[i];
            emit(word, 1);
        }
    }
    
    function reduce(key, values, output) {
        var totalCount = 0;
        for(var i in values) {
            totalCount += values[i];
        }
        output(key + ' -> ' + totalCount);
    }
    
    return mapReduce(input, map, reduce);
}

function demo() {
    var input = [
        "hello world",
        "hello map reduce",
        "map map"
    ];
    
    var wordsCount = wc(input);
    
    console.log(JSON.stringify(wordsCount, null, 4));
}