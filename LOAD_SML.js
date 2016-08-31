/**
 * .sml 파일을 가져온 뒤 수정사항이 있을 때 까지 저장합니다.
 */
global.LOAD_SML = METHOD(function(m) {
	
	var
	// cached file infos
	cachedFileInfos = {};
	
	return {
		
		run : function(path, handlers) {
			//REQUIRED: path
			//REQUIRED: handlers
			//REQUIRED: handlers.notExists
			//REQUIRED: handlers.error
			//REQUIRED: handlers.success
			
			var
			// not exists handler.
			notExistsHandler = handlers.notExists,
			
			// error handler.
			errorHandler = handlers.error,
			
			// handler.
			handler = handlers.success;
			
			// check file has been updated.
			GET_FILE_INFO(path, {
				notExists : notExistsHandler,
				success : function(fileInfo) {
					
					var
					// cached file info
					cachedFileInfo = cachedFileInfos[path];
					
					if (cachedFileInfo !== undefined
						&& (
							(fileInfo.lastUpdateTime !== undefined && cachedFileInfo.lastUpdateTime.getTime() === fileInfo.lastUpdateTime.getTime())
							|| (fileInfo.createTime !== undefined && cachedFileInfo.lastUpdateTime.getTime() === fileInfo.createTime.getTime())
						)
					) {
						handler(cachedFileInfo.html);
					}
					
					else {
						
						READ_FILE(path, {
							notExists : notExistsHandler,
							error : errorHandler,
							success : function(buffer) {
								
								var
								// html
								html = SML(buffer.toString());
								
								cachedFileInfos[path] = {
									lastUpdateTime : fileInfo.lastUpdateTime === undefined ? fileInfo.createTime : fileInfo.lastUpdateTime,
									html : html
								};
								
								handler(html);
							}
						});
					}
				}
			});
		}
	};
});