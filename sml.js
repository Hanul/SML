global.sml = METHOD(function() {
	
	var
	// parse value.
	parseValue = function(value, tabCount) {
		
		// string
		if (value[0] === '\'') {
			
			return '"' + RUN(function() {
				
				var
				// ret
				ret = '',
				
				// now tab count
				nowTabCount = 0;
				
				value = value.substring(1, value.length - 1).trim();
				
				EACH(value, function(ch, i) {
					
					if (nowTabCount !== -1) {
						if (ch === '\t') {
							nowTabCount += 1;
							if (nowTabCount === tabCount + 1) {
								nowTabCount = -1;
							}
						} else {
							nowTabCount = -1;
						}
					}
					
					if (nowTabCount === -1) {
						
						if (ch === '\r' || (ch === '\\' && value[i + 1] === '\'')) {
							// ignore.
						} else if (ch === '"') {
							ret += '\\"';
						} else if (ch === '\n') {
							ret += '\\n';
							nowTabCount = 0;
						} else {
							ret += ch;
						}
					}
				});
				
				return ret;
				
			}) + '"';
		}
		
		// array
		else if (value[0] === '[') {
			
			return '[' + RUN(function() {
				
				var
				// content
				content = value.substring(1, value.length - 1).trim(),
				
				// last index
				lastIndex = 0,
				
				// is string mode
				isStringMode,
				
				// array level
				arrayLevel = 0,
				
				// value
				v = '',
				
				// ret
				ret = '';
				
				EACH(content, function(ch, i) {
					
					if (isStringMode !== true && ch === '[') {
						arrayLevel += 1;
					}
					
					else if (isStringMode !== true && ch === ']') {
						arrayLevel -= 1;
					}
					
					else if (ch === '\'' && content[i - 1] !== '\\') {
						if (isStringMode === true) {
							isStringMode = false;
						} else {
							isStringMode = true;
						}
					}
					
					else if (isStringMode !== true && arrayLevel === 0 && ch === ',') {
						
						v = parseValue(content.substring(lastIndex, i).trim(), tabCount);
						
						if (v !== '') {
							ret += v + ', ';
						}
						
						lastIndex = i + 1;
					}
				});
				
				ret += parseValue(content.substring(lastIndex).trim(), tabCount);
				
				return ret;
				
			}) + ']';
		}
		
		// boolean, number
		else if (value === 'true' || value === 'false' || isNaN(value) !== true) {
			return value;
		}
		
		else {
			
			REPEAT(tabCount, function() {
				value = '\t' + value;
			});
			
			return parse(value, tabCount);
		}
	},
	
	// parse.
	parse = function(content, tabCount) {
		//REQUIRED: content
		//REQUIRED: tabCount
		
		var
		// json
		json = '',
		
		// sub content
		subContent = '',
		
		// last index
		lastIndex = 0,
		
		// is string mode
		isStringMode,
		
		// array level
		arrayLevel = 0,
		
		// parse line.
		parseLine = function(line) {
			
			var
			// tag
			tag,
			
			// now tab count
			nowTabCount = 0,
			
			// value
			value = undefined;
			
			EACH(line, function(ch) {
				if (ch === '\t') {
					nowTabCount += 1;
				} else {
					return false;
				}
			});
			
			if (line.trim() !== '') {
				
				if (nowTabCount === tabCount) {
					
					// parse sub json.
					if (subContent !== '') {
						json += parse(subContent, tabCount + 1) + ',\n';
						subContent = '';
					}
					
					REPEAT(tabCount, function() {
						json += '\t';
					});
					
					// find tag.
					tag = '';
					line = line.trim();
					EACH(line, function(ch, i) {
						if (ch === ' ' || ch === '\t') {
							value = line.substring(i).trim();
							return false;
						}
						tag += ch;
					});
					
					json += '<' + tag + '>';
					
					// parse value.
					if (value !== undefined) {
						json += parseValue(value, tabCount + 1) + '\n';
					}
					
					json += '</' + tag + '>';
				}
				
				else {
					subContent += line + '\n';
				}
			}
		};
		
		EACH(content, function(ch, i) {
			
			if (isStringMode !== true && ch === '[') {
				arrayLevel += 1;
			}
			
			else if (isStringMode !== true && ch === ']') {
				arrayLevel -= 1;
			}
			
			else if (ch === '\'' && content[i - 1] !== '\\') {
				if (isStringMode === true) {
					isStringMode = false;
				} else {
					isStringMode = true;
				}
			}
			
			else if (isStringMode !== true && arrayLevel === 0 && ch === '\n') {
				parseLine(content.substring(lastIndex, i));
				lastIndex = i + 1;
			}
		});
		
		parseLine(content.substring(lastIndex));
		
		if (subContent !== '') {
			json += parse(subContent, tabCount + 1) + '\n';
		} else {
			json = json.substring(0, json.length - 2) + '\n';
		}
		
		REPEAT(tabCount, function() {
			json += '\t';
		});
		
		return '\n' + json;
	};
	
	return {
		
		run : function(content) {
			//REQUIRED: content
			
			return parse(content, 0);
		}
	};
});
