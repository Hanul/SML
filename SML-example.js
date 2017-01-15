require('./import/UPPERCASE-CORE/NODE.js');
require('./SML.js');

var html = SML(READ_FILE({
	path : 'example.sml',
	isSync : true
}).toString());

console.log(html);
