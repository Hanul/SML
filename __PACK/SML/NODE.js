SML.Bridge=METHOD(t=>{let n=require("path"),i=(t,n)=>{t({statusCode:500,content:'<!doctype html><html><head><meta charset="UTF-8"><title>'+n+"</title></head><body>Error</body></html>",contentType:"text/html"})},e=t=>{t({statusCode:404,content:'<!doctype html><html><head><meta charset="UTF-8"><title>Page not found.</title></head><body><p><b>Page not found.</b></p></body></html>',contentType:"text/html"})};return{run:t=>{let o=t.rootPath;return{notExistsHandler:(t,n,i)=>{e(i)},requestListener:(t,u,r,s)=>{let c,m,d=t.uri;return run=(()=>{SML.Load(c,{notExists:()=>{e(u)},error:t=>{i(u,t)},success:t=>{u({content:t,contentType:"text/html"})}})}),NEXT([t=>{""===d?CHECK_FILE_EXISTS(o+"/index.sml",n=>{d=n===!0?"index.sml":"index.html",t()}):t()},()=>{return()=>{c=o+"/"+d,m=n.extname(d).toLowerCase(),".sml"===m?run():""===m?NEXT([t=>{CHECK_FILE_EXISTS(c+".sml",n=>{n===!0?CHECK_IS_FOLDER(c+".sml",n=>{n===!0?t():(c+=".sml",run())}):t()})},()=>{return()=>{CHECK_FILE_EXISTS(c,t=>{t===!0?CHECK_IS_FOLDER(c,t=>{t===!0?(c+="/index.sml",run()):s()}):s()})}}]):s()}}]),!1}}}}}),SML.Compile=METHOD(()=>{let t=(n,i,e)=>{let o,u,r,s="",c="",m=0,d=n=>{let u,r,m=0,d="",f="",E=[];if(EACH(n,t=>{return"\t"===t&&void(m+=1)}),""!==n.trim())if(m===i){if(n=n.trim(),"#"!==n[0]&&(""!==c?void 0!==o?(s+=">\n"+t(c,i+1,e),c="",REPEAT(i+e+1,()=>{s+="\t"}),s+="</"+o+">\n",o=void 0):(s+=t(c,i+1,e-1),c="",REPEAT(i+e-1,()=>{s+="\t"})):void 0!==o&&"'"!==o&&"`"!==o&&(s+="meta"===o||"link"===o||"br"===o?">\n":"script"===o?"></script>\n":" />\n"),REPEAT(i+e+1,()=>{s+="\t"}),"'"===n[0]?(o="'",u=n):"`"===n[0]?(o="`",u=n):(o="",EACH(n,(t,i)=>{return" "===t||"\t"===t?(u=n.substring(i),!1):void("#"===t||"."===t?(""!==f&&(E.push(f),f=""),r=t):"#"===r?d+=t:"."===r?f+=t:o+=t)}),""!==f&&(E.push(f),f=""),s+="<"+o),E.length>0&&(u=" class='"+RUN(()=>{let t="";return EACH(E,(n,i)=>{i>0&&(t+=" "),t+=n}),t})+"'"+(void 0===u?"":u)),""!==d&&(u=" id='"+d+"'"+(void 0===u?"":u)),void 0!==u)){let t,n,r="",c="",m="",d=0;EACH(u,(s,f)=>{n!==!0&&"'"===s&&"\\"!==u[f-1]?t===!0?(""===m.trim()?c+=RUN(()=>{let t=u.substring(d+1,f),n="",o=i+1;return EACH(t,(u,r)=>{o!==-1&&("\t"===u?(o+=1,o===i+2&&(o=-1)):o=-1),o===-1&&("\r"===u||"\\"===u&&"'"===t[r+1]||("\n"===u?(""!==n&&""!==t.substring(r).trim()&&(n+="<br>"),n+="\n",REPEAT(o+e+2,()=>{n+="\t"}),o=i+1):n+=u))}),n}):"meta"===o?(m=m.trim(),m=m.substring(0,m.length-1),r+=' name="'+m+'" content="'+u.substring(d+1,f)+'"'):r+=m+'"'+u.substring(d+1,f)+'"',m="",t=!1):t=!0:t!==!0&&"`"===s&&"\\"!==u[f-1]?n===!0?(""===m.trim()&&(c+=u.substring(d+1,f)),m="",n=!1):n=!0:t!==!0&&n!==!0&&(m+=s,d=f+1)}),t!==!0&&n!==!0||SHOW_ERROR("[SML] 문자열 구문이 아직 끝나지 않았습니다.",u),""===c?s+=r:(s+="'"===o||"`"===o?c+"\n":r+">"+c+"</"+o+">\n",o=void 0)}}else c+=n+"\n"};return EACH(n,(t,i)=>{r!==!0&&"'"===t&&"\\"!==n[i-1]?u=u!==!0:u!==!0&&"`"===t&&"\\"!==n[i-1]?r=r!==!0:u!==!0&&r!==!0&&"\n"===t&&(d(n.substring(m,i)),m=i+1)}),u===!0||r===!0?SHOW_ERROR("[SML] 문자열 구문이 아직 끝나지 않았습니다.",n.substring(m)):d(n.substring(m)),""!==c?void 0!==o?(s+=">\n"+t(c,i+1,e),REPEAT(i+e+1,()=>{s+="\t"}),s+="</"+o+">\n",o=void 0):(s+=t(c,i+1,e-1),REPEAT(i+e-1,()=>{s+="\t"})):void 0!==o&&"'"!==o&&"`"!==o&&(s+="meta"===o||"link"===o||"br"===o?">\n":"script"===o?"></script>\n":" />\n"),s};return{run:n=>{let i,e,o=n.indexOf("body");return"\n"!==n[o+4]||0!==o&&"\n"!==n[o-1]?(i="",e=t(n,0,1)):(i=t(n.substring(0,o),0,1),e=t(n.substring(o),0,0)),'<!doctype html>\n<html>\n\t<head>\n\t\t<meta charset="UTF-8">\n'+i+"\t</head>\n"+e+"</html>"}}}),SML.Load=METHOD(t=>{let n={};return{run:(t,i)=>{let e=i.notExists,o=i.error,u=i.success;GET_FILE_INFO(t,{notExists:e,success:i=>{let r=n[t];void 0!==r&&(void 0!==i.lastUpdateTime&&r.lastUpdateTime.getTime()===i.lastUpdateTime.getTime()||void 0!==i.createTime&&r.lastUpdateTime.getTime()===i.createTime.getTime())?u(r.html):READ_FILE(t,{notExists:e,error:o,success:e=>{let o=SML.Compile(e.toString());n[t]={lastUpdateTime:void 0===i.lastUpdateTime?i.createTime:i.lastUpdateTime,html:o},u(o)}})}})}}});