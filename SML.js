/**
 * HTML로 변환되는 간단한 데이터 표현식
 */
global.SML = METHOD(function() {
	'use strict';
	
	var
	// parse value.
	parseValue = function(tag, value, tabCount, appendTabCount) {
		
		var
		// attrs
		attrs = '',
		
		// content
		content = '',
		
		// attribute name
		attrName = '',
		
		// last index
		lastIndex = 0,
		
		// is string mode
		isStringMode;
		
		EACH(value, function(ch, i) {
			
			if (ch === '\'' && value[i - 1] !== '\\') {
				if (isStringMode === true) {
					
					if (attrName.trim() === '') {
						content += RUN(function() {
							
							var
							// sub content
							subContent = value.substring(lastIndex + 1, i),
							
							// ret
							ret = '',
							
							// now tab count
							nowTabCount = tabCount;
							
							EACH(subContent, function(ch, i) {
								
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
									
									if (ch === '\r' || (ch === '\\' && subContent[i + 1] === '\'')) {
										// ignore.
									} else if (ch === '\n') {
										
										if (ret !== '' && i < subContent.length - 2) {
											ret += '<br>';
										}
										
										ret += '\n';
										
										REPEAT(nowTabCount + appendTabCount + 2, function() {
											ret += '\t';
										});
										
										nowTabCount = tabCount;
									} else {
										ret += ch;
									}
								}
							});
							
							return ret;
						});
					}
					
					else if (tag === 'meta') {
						attrName = attrName.trim();
						attrName = attrName.substring(0, attrName.length - 1);
						attrs += ' name=' + '"' + attrName + '" content="' + value.substring(lastIndex + 1, i) + '"';
					}
					
					else {
						attrs += attrName + '"' + value.substring(lastIndex + 1, i) + '"';
					}
					
					attrName = '';
 					
					isStringMode = false;
				} else {
					isStringMode = true;
				}
			}
			
			else if (isStringMode !== true) {
				attrName += ch;
				lastIndex = i + 1;
			}
		});
		
		if (isStringMode === true) {
			console.log('[SML] parse error.');
		}
		
		return attrs + (content === '' ? (tag === 'meta' || tag === 'br' ? '>' : ' />') : '>' + content + '</' + tag + '>');
	},
	
	// parse.
	parse = function(content, tabCount, appendTabCount) {
		//REQUIRED: content
		//REQUIRED: tabCount
		//REQUIRED: appendTabCount
		
		var
		// html
		html = '',
		
		// tag
		tag,
		
		// sub content
		subContent = '',
		
		// last index
		lastIndex = 0,
		
		// is string mode
		isStringMode,
		
		// parse line.
		parseLine = function(line) {
			
			var
			// now tab count
			nowTabCount = 0,
			
			// value
			value,
			
			// id
			id,
			
			// clss
			clss,
			
			// cls
			cls;
			
			EACH(line, function(ch) {
				if (ch === '\t') {
					nowTabCount += 1;
				} else {
					return false;
				}
			});
			
			if (line.trim() !== '') {
				
				if (nowTabCount === tabCount) {
					
					// parse sub html.
					if (subContent !== '') {
						
						html += '>\n' + parse(subContent, tabCount + 1, appendTabCount);
						subContent = '';
						
						REPEAT(tabCount + appendTabCount + 1, function() {
							html += '\t';
						});
						
						html += '</' + tag + '>\n';
						tag = undefined;
					}
					
					else if (tag !== undefined) {
						html += ' />\n';
					}
					
					REPEAT(tabCount + appendTabCount + 1, function() {
						html += '\t';
					});
					
					// find tag.
					tag = '';
					line = line.trim();
					EACH(line, function(ch, i) {
						
						if (ch === ' ' || ch === '\t' || ch === '#' || ch === '.') {
							
							if (cls !== undefined) {
								if (clss === undefined) {
									clss = [];
								}
								clss.push(cls);
							}
						}
						
						if (ch === ' ' || ch === '\t') {
							value = line.substring(i);
							return false;
						}
						
						// id
						else if (ch === '#') {
							id = '';
							cls = undefined;
						}
						
						// cls
						else if (ch === '.') {
							id = undefined;
							cls = '';
						}
						
						else {
							if (id !== undefined) {
								id += ch;
							} else if (cls !== undefined) {
								cls += ch;
							} else {
								tag += ch;
							}
						}
					});
					
					html += '<' + tag;
					
					if (id !== undefined) {
						value = ' id=\'' + id + '\'' + (value === undefined ? '' : ' ' + value);
					}
					
					if (clss !== undefined) {
						value = ' class=\'' + RUN(function() {
							
							var
							// ret
							ret = '';
							
							EACH(clss, function(cls, i) {
								if (i > 0) {
									ret += ' ';
								}
								ret += cls;
							});
							
							return ret;
						}) + '\'' + (value === undefined ? '' : ' ' + value);
					}
					
					// parse value.
					if (value !== undefined) {
						html += parseValue(tag, value, tabCount + 1, appendTabCount) + '\n';
						tag = undefined;
					}
				}
				
				else {
					subContent += line + '\n';
				}
			}
		};
		
		EACH(content, function(ch, i) {
			
			if (ch === '\'' && content[i - 1] !== '\\') {
				if (isStringMode === true) {
					isStringMode = false;
				} else {
					isStringMode = true;
				}
			}
			
			else if (isStringMode !== true && ch === '\n') {
				parseLine(content.substring(lastIndex, i));
				lastIndex = i + 1;
			}
		});
		
		if (isStringMode === true) {
			console.log('[SML] parse error.');
		}
		
		else {
			parseLine(content.substring(lastIndex));
		}
		
		if (subContent !== '') {
			
			html += '>\n' + parse(subContent, tabCount + 1, appendTabCount);
			
			REPEAT(tabCount + appendTabCount + 1, function() {
				html += '\t';
			});
			
			html += '</' + tag + '>\n';
			tag = undefined;
			
		} else if (tag !== undefined) {
			html += ' />\n';
		}
		
		return html;
	};
	
	return {
		
		run : function(content) {
			//REQUIRED: content
			
			var
			// body start index
			bodyStartIndex = content.indexOf('body'),
			
			// head
			head,
			
			// body
			body;
			
			if (content[bodyStartIndex + 5] === '\n' && (bodyStartIndex === 0 || content[bodyStartIndex - 1] === '\n')) {
				head = parse(content.substring(0, bodyStartIndex), 0, 1);
				body = parse(content.substring(bodyStartIndex), 0, 0);
			}
			
			else {
				head = parse(content, 0, 1);
				body = '';
			}
			
			return '<!doctype html>\n<html>\n\t<head>\n\t\t<meta charset="UTF-8">\n' + head + '\t</head>\n' + body + '</html>';
		}
	};
});
