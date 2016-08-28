require('./import/UJS-NODE.js');
require('./sml.js');

var html = sml(READ_FILE({
	path : 'example.sml',
	isSync : true
}).toString());

console.log(html);
