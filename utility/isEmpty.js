/*
returns array of empty keys 
*/

module.exports = (obj, keysArray) => {
  let result = { empty: true, keys: [] };
  let emptyKeys = [];
  keysArray.forEach(element => {
    if (obj[element]) {
      result.empty = false;
    } else {
      emptyKeys.push(element);
    }
  });
  result.keys = emptyKeys;
  return result;
};
