map-reduce-matrix-multiplication-js
===================================

### Example: Words Count ###
Let's implement classical example of MapReduce computations model: counting words via MapReduce.
  1. Use `mapReduce` function from: https://github.com/lagodiuk/mini-map-reduce-js/blob/master/map-reduce.js
  2. Map function:
  
  ```javascript
  function map(row, emit) {
    var words = row.split(' ');
    for(var i in words) {
      var word = words[i];
      emit(word, 1);
    }
  }
  ```
  3. Reduce function:
  
  ```javascript
  function reduce(key, values, output) {
    var totalCount = 0;
    for(var i in values) {
      totalCount += values[i];
    }
    output(key + ' -> ' + totalCount);
  }
  ```
  4. Lets calculate words:
  
  ```javascript
  var input = [
    "hello world",
    "hello map reduce",
    "map map"
  ];
  var wordsCount = mapReduce(input, map, reduce);;
  ```
  5. `wordsCount` will be:
  
  ```javascript
  [
    "hello -> 2",
    "world -> 1",
    "map -> 3",
    "reduce -> 1"
  ] 
  ```
(see: https://github.com/lagodiuk/mini-map-reduce-js/blob/master/words-count.js)

### Matrixes Multiplication ###

Prototype of 2-step MapReduce algorithm for matrix multiplication

Description of algorithm was found here: http://importantfish.com/two-step-matrix-multiplication-with-hadoop/
