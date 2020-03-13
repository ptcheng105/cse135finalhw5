//a function to get the cookie from browser
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
        c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
    }
    }
    return "";
}
//1. grab the cookie and hit cloud function to get user id and session id
let cookie = document.cookie;
let userCookie = getCookie("userID");
let sessionCookie = getCookie("sessionID");

var xhr = new XMLHttpRequest();

xhr.open("GET", "https://cse135winter2020hw3.firebaseapp.com/sessionize");
xhr.withCredentials = true;
xhr.send();

//2. collect data
function collectStaticData() {
    let staticData = {}
    staticData.user_agent = navigator.userAgent; //check user agent
    staticData.user_language = navigator.language; //check language
    staticData.cookie_enabled = navigator.cookieEnabled; //check cookie
    staticData.js_enable = true;    //check js
    let image = new Image(10, 10);   //check image
    image.src = "../media/smalltestsvg.svg"
    staticData.image_enabled = image.width > 0 ? true : false;

    //check if css is on
    let testdiv = document.createElement('div');
    testdiv.id = "testdiv"
    testdiv.style.setProperty("--testdiv", "tested");
    staticData.css_enabled = testdiv.style.getPropertyValue("--testdiv") == "tested" ? true : false;

    //check screen dimension
    staticData.screen_height = screen.availHeight;
    staticData.screen_width = screen.availWidth;

    //check window dimension
    staticData.window_inner_height = window.innerHeight;
    staticData.window_inner_width = window.innerWidth;

    //re-collect data if window resized
    window.addEventListener("resize", () => {
        staticData.window_inner_height = window.innerHeight;
        staticData.window_inner_width = window.innerWidth;
    })

    staticData.connection_type = navigator.connection.effectiveType;
    return staticData;
}

function collectPageLoadInfo() {
    
    let pageLoadInfo = {}
    let pft = performance.timing;

    pageLoadInfo.startTime = pft.requestStart
    pageLoadInfo.endTime = pft.loadEventStart
    pageLoadInfo.totalTimeSpent = pft.loadEventStart - pft.requestStart

    pageLoadInfo.responseStart = pft.responseStart
    pageLoadInfo.responseEnd = pft.responseEnd
    pageLoadInfo.domLoading = pft.domLoading
    pageLoadInfo.domInteractive = pft.domInteractive
    pageLoadInfo.domContentLoadedEventStart = pft.domContentLoadedEventStart
    pageLoadInfo.domContentLoadedEventEnd = pft.domContentLoadedEventEnd
    pageLoadInfo.domComplete = pft.domComplete

    return pageLoadInfo
}

function startCollectDynamicData(static_data, perform) {
    let dynamic_data = {}
    let trigger_idle;
    let idle_start_time;

    dynamic_data.events_list = []
    //get idle time
    function resetPause() {
        clearTimeout(trigger_idle);
        trigger_idle = setTimeout(start_idle, 2000);
    }

    function start_idle() {
        idle_start_time = new Date().getTime();
    }

    function end_idle() {
        if (idle_start_time > 0) {
            let idle_end_time = new Date().getTime();
            dynamic_data.events_list.push(["idle", idle_start_time, idle_end_time])
                idle_start_time = 0
        }
    }
    //start counting idle after load
    resetPause();

    //mouse click
    window.addEventListener('click', event => {
        resetPause()
        end_idle()
        //save the time and number of clicks [time, x, y]
        let one_click = ["click", new Date().getTime(), event.clientX, event.clientY]
        dynamic_data.events_list.push(one_click)
    })

    let move_end;
    let last_move_position;
    function moving() {
        if (move_end != null) clearTimeout(move_end);
        move_end = setTimeout(save_move_end, 100);
    }
    function save_move_end() {
        if (last_move_position != null) {
            //save the time and position [time, x, y]
            let one_move = ["moved", new Date().getTime(), last_move_position[0], last_move_position[1]]
            dynamic_data.events_list.push(one_move)
        }
    }
    //mouse movement
    window.addEventListener('mousemove', event => {
        resetPause()
        end_idle()
        moving();
        //record the position
        last_move_position = [event.clientX, event.clientY]
    })

    //keypress
    window.addEventListener('keypress', event => {
        resetPause()
        end_idle()
        //save the time and key [time, code]
        let one_press = ["key", new Date().getTime(), event.code]
        dynamic_data.events_list.push(one_press)
    })

    //scrolling
    window.addEventListener('scroll', e => {
        resetPause()
        end_idle()
        //save the time and position [time, scroll position]
        let one_scroll = ["scroll", new Date().getTime(), window.scrollY]
        dynamic_data.events_list.push(one_scroll)
    })

    //beforeunload TODO
    window.addEventListener('beforeunload', e => {
        clearTimeout(trigger_idle)
        end_idle()
        //record currnet time
        let unload_time = new Date().getTime();
        dynamic_data.events_list.push(["unload", unload_time])
        //save to endpoint
        one_report = {
            "page": document.URL,
            "time": unload_time,
            "staticData": static_data,
            "pageLoadInfo": perform,
            "dynamicData": dynamic_data
        }
        //Send report to collect endpoint
        collectxhr = new XMLHttpRequest();
        collectxhr.open("POST", "https://cse135winter2020hw3.firebaseapp.com/collect");
        collectxhr.withCredentials = true;
        body = JSON.stringify(one_report);
        collectxhr.send(body);
    })
}

let collected_static = collectStaticData();
let perform;
window.addEventListener('load', () => {
    perform = collectPageLoadInfo();
    startCollectDynamicData(collected_static, perform);
});