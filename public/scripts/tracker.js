function getCookie(e){for(var t=e+"=",n=decodeURIComponent(document.cookie).split(";"),i=0;i<n.length;i++){for(var o=n[i];" "==o.charAt(0);)o=o.substring(1);if(0==o.indexOf(t))return o.substring(t.length,o.length)}return""}let cookie=document.cookie,userCookie=getCookie("userID"),sessionCookie=getCookie("sessionID");var xhr=new XMLHttpRequest;function collectStaticData(){let e={};e.user_agent=navigator.userAgent,e.user_language=navigator.language,e.cookie_enabled=navigator.cookieEnabled,e.js_enable=!0;let t=new Image(10,10);t.src="../media/smalltestsvg.svg",e.image_enabled=t.width>0;let n=document.createElement("div");return n.id="testdiv",n.style.setProperty("--testdiv","tested"),e.css_enabled="tested"==n.style.getPropertyValue("--testdiv"),e.screen_height=screen.availHeight,e.screen_width=screen.availWidth,e.window_inner_height=window.innerHeight,e.window_inner_width=window.innerWidth,window.addEventListener("resize",()=>{e.window_inner_height=window.innerHeight,e.window_inner_width=window.innerWidth}),e.connection_type=navigator.connection.effectiveType,e}function collectPageLoadInfo(){let e={},t=performance.timing;return e.startTime=t.requestStart,e.endTime=t.loadEventStart,e.totalTimeSpent=t.loadEventStart-t.requestStart,e.responseStart=t.responseStart,e.responseEnd=t.responseEnd,e.domLoading=t.domLoading,e.domInteractive=t.domInteractive,e.domContentLoadedEventStart=t.domContentLoadedEventStart,e.domContentLoadedEventEnd=t.domContentLoadedEventEnd,e.domComplete=t.domComplete,e}function startCollectDynamicData(e,t){let n,i,o,a,r={};function s(){clearTimeout(n),n=setTimeout(d,2e3)}function d(){i=(new Date).getTime()}function l(){if(i>0){let e=(new Date).getTime();r.events_list.push(["idle",i,e]),i=0}}function c(){if(null!=a){let e=["moved",(new Date).getTime(),a[0],a[1]];r.events_list.push(e)}}r.events_list=[],s(),window.addEventListener("click",e=>{s(),l();let t=["click",(new Date).getTime(),e.clientX,e.clientY];r.events_list.push(t)}),window.addEventListener("mousemove",e=>{s(),l(),null!=o&&clearTimeout(o),o=setTimeout(c,100),a=[e.clientX,e.clientY]}),window.addEventListener("keypress",e=>{s(),l();let t=["key",(new Date).getTime(),e.code];r.events_list.push(t)}),window.addEventListener("scroll",e=>{s(),l();let t=["scroll",(new Date).getTime(),window.scrollY];r.events_list.push(t)}),window.addEventListener("beforeunload",i=>{clearTimeout(n),l();let o=(new Date).getTime();r.events_list.push(["unload",o]),one_report={page:document.URL,time:o,staticData:e,pageLoadInfo:t,dynamicData:r},collectxhr=new XMLHttpRequest,collectxhr.open("POST","https://cse135hw5timeben.firebaseapp.com/collect"),collectxhr.withCredentials=!0,body=JSON.stringify(one_report),collectxhr.send(body)})}xhr.open("GET","https://cse135hw5timeben.firebaseapp.com/sessionize"),xhr.withCredentials=!0,xhr.send();let perform,collected_static=collectStaticData();window.addEventListener("load",()=>{perform=collectPageLoadInfo(),startCollectDynamicData(collected_static,perform)});