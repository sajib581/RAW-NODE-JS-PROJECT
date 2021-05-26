const text = '#2A2A2A';
// const regex = /#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/g;

const regex = /#?(\d[a-fA-F])+/g;

const matches = text.match(regex);

const index = text.search(regex);

const replaced = text.replace(regex, '#000000');

const testing = regex.test(text);

console.log(matches, index, replaced, testing);
