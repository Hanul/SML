/**
 * RESOURCE_SERVER를 위한 SML 브릿지
 */
global.SML_BRIDGE = METHOD(function(m) {
	
	var
	//IMPORT: Path
	Path = require('path'),

	// response error.
	responseError = function(response, error) {
		
		response({
			statusCode : 500,
			content : 
				'<!doctype html><html><head><meta charset="UTF-8"><title>' + error + '</title></head><body>' +
				'Error' +
				'</body></html>',
			contentType : 'text/html'
		});
	},
	
	// response not found.
	responseNotFound = function(response) {
		
		response({
			statusCode : 404,
			content : 
				'<!doctype html><html><head><meta charset="UTF-8"><title>Page not found.</title></head><body>' +
				'<p><b>Page not found.</b></p>' +
				'</body></html>',
			contentType : 'text/html'
		});
	};
	
	return {
		
		run : function(config) {
			
			var
			// root path
			rootPath = config.rootPath;
			
			return {
				
				notExistsHandler : function(resourcePath, requestInfo, response) {
					responseNotFound(response);
				},
				
				requestListener : function(requestInfo, response, onDisconnected, setRootPath, next) {
					
					var
					// uri
					uri = requestInfo.uri,
					
					// path
					path,
					
					// ext
					ext,
					
					// run.
					run = function() {
						
						LOAD_SML(path, {
							notExists : function() {
								responseNotFound(response);
							},
							error : function(e) {
								responseError(response, e);
							},
							success : function(html) {
								
								response({
									content : html,
									contentType : 'text/html'
								});
							}
						});
					};
					
					NEXT([
					function(next) {
						
						// server root path. (index)
						if (uri === '') {
							
							CHECK_IS_EXISTS_FILE(rootPath + '/index.sml', function(isExists) {
								if (isExists === true) {
									uri = 'index.sml';
								} else {
									uri = 'index.html';
								}
								next();
							});
							
						} else {
							next();
						}
					},
					
					function() {
						return function() {
							
							path = rootPath + '/' + uri;
					
							ext = Path.extname(uri).toLowerCase();
							
							// serve .sml file.
							if (ext === '.sml') {
								run();
							}
							
							else if (ext === '') {
								
								NEXT([
								function(next) {
									
									// serve .sml file.
									CHECK_IS_EXISTS_FILE(path + '.sml', function(isExists) {
										
										if (isExists === true) {
											
											CHECK_IS_FOLDER(path + '.sml', function(isFolder) {
												
												if (isFolder === true) {
													next();
												} else {
													path += '.sml';
													run();
												}
											});
										}
										
										else {
											next();
										}
									});
								},
								
								function() {
									return function() {
										
										// serve static file.
										CHECK_IS_EXISTS_FILE(path, function(isExists) {
											
											if (isExists === true) {
											
												// but when path is folder, run SML.
												CHECK_IS_FOLDER(path, function(isFolder) {
													
													if (isFolder === true) {
														path += '/index.sml';
														run();
													} else {
														next();
													}
												});
											}
											
											else {
												next();
											}
										});
									};
								}]);
							}
							
							else {
								next();
							}
						};
					}]);
					
					return false;
				}
			};
		}
	};
});