let users_list;
let sessions_list;

//1. get users list
let user_xhr = new XMLHttpRequest();
user_xhr.open("GET", "https://cse135timbenfinalproject.firebaseapp.com/getUsers",true);
user_xhr.onreadystatechange = function () {
    if(user_xhr.readyState === XMLHttpRequest.DONE && user_xhr.status === 200) {
        users_list = responseStr2array(user_xhr.responseText);
        //populate a select box with users
        initSelectWithArray('select_user', users_list);
    }
};
user_xhr.send();

//2. get sessions list
let session_xhr = new XMLHttpRequest();
session_xhr.open("GET", "https://cse135timbenfinalproject.firebaseapp.com/getSessions",true);
session_xhr.onreadystatechange = function () {
    if(session_xhr.readyState === XMLHttpRequest.DONE && session_xhr.status === 200) {
        sessions_list = responseStr2array(session_xhr.responseText);
        //populate a select box with sessions
        initSelectWithArray('select_session', sessions_list);
    }
};
session_xhr.send();

//3. when user id is selected update new sessions
document.getElementById("select_user").addEventListener("change", ()=>{
    let userID = document.getElementById("select_user").value;
    //clear select seesion options
    let e = document.getElementById("select_session");
    var child = e.lastElementChild;  
    while (child) { 
        e.removeChild(child); 
        child = e.lastElementChild; 
    }
    //request new sessions
    let new_session_xhr = new XMLHttpRequest();
    new_session_xhr.open("GET", `https://cse135timbenfinalproject.firebaseapp.com/getSessions?user=${userID}`,true);
    new_session_xhr.onreadystatechange = function () {
    if(new_session_xhr.readyState === XMLHttpRequest.DONE && new_session_xhr.status === 200) {
        sessions_list = responseStr2array(new_session_xhr.responseText);
        //populate a select box with sessions
        initSelectWithArray('select_session', sessions_list);
    }
    };
    new_session_xhr.send();
})

//4. when session id is selected request the data to display from server endpoint and display it
document.getElementById("select_session").addEventListener("change", ()=>{
    let sessionID = document.getElementById("select_session").value;
    //request new sessions
    let session_data = new XMLHttpRequest();
    session_data.open("GET", `https://cse135timbenfinalproject.firebaseapp.com/getSessionData?sessionID=${sessionID}`,true);
    session_data.onreadystatechange = function () {
    if(session_data.readyState === XMLHttpRequest.DONE && session_data.status === 200) {
        let reportObj = JSON.parse(session_data.responseText);
        
        if(!reportObj.staticData || !reportObj.pageLoadInfo || !reportObj.dynamicData){
            document.getElementById("page_origin").innerText = `Page Origin: ${reportObj.page}, No data recorded for this session`
            //clear table
            clearTable();
        }else{
            clearTable();
            document.getElementById("page_origin").innerText = `Page Origin: ${reportObj.page}`;
            buildTable("Static Data", "static_table", reportObj.staticData, false);
            buildTable("Page Load Data", "page_load_table", reportObj.pageLoadInfo, true);
            buildActionList(reportObj.pageLoadInfo.endTime, reportObj.dynamicData.events_list);  
        }
    }
    };
    session_data.send();
})

function clearTable(){
    let section = document.getElementById("dynamic_action_list")
    //clear list first
    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }
    //remove old table if exist
    let table = document.getElementById("static_table");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    //remove old table if exist
    table = document.getElementById("page_load_table");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
}

function buildActionList(pageloaded, event_list) {
    let section = document.getElementById("dynamic_action_list")
    //clear list first
    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }
    let title = document.createElement("p")
    title.innerHTML = "<b>User Actions in order: (time=0 ms when page loaded)</b>"
    section.appendChild(title);
    let div = document.createElement("div")
    section.appendChild(div);

    event_list.forEach(element => {
        let entry = document.createElement("p");
        
        switch (element[0]) {
            case "idle":
                entry.innerText = `Idle from ${element[1] - pageloaded} ms to ${element[2] - pageloaded} ms`;
                entry.setAttribute("class", "idle");
                div.appendChild(entry);
                break;
            case "click":
                entry.innerText = `Clicked on x=${element[2]} y=${element[3]} at ${element[1] - pageloaded} ms`;
                entry.setAttribute("class", "click");
                div.appendChild(entry);
                break;
            case "moved":
                entry.innerText = `Moved to x=${element[2]} y=${element[3]} at ${element[1] - pageloaded} ms`;
                entry.setAttribute("class", "moved");
                div.appendChild(entry);
                break;
            case "key":
                entry.innerText = `Pressed Key: ${element[2]} at ${element[1] - pageloaded} ms`;
                entry.setAttribute("class", "key");
                div.appendChild(entry);
                break;
            case "scroll":
                entry.innerText = `Scrolled to ${element[2]} at ${element[1] - pageloaded} ms`;
                entry.setAttribute("class", "scroll");
                div.appendChild(entry);
                break;
            case "unload":
                entry.innerText = `Page Unloaded at ${element[1] - pageloaded} ms`;
                entry.setAttribute("class", "unload");
                div.appendChild(entry);
                break;
            default:
                console.log("error entry")
        }
        entry.setAttribute("onclick", `createConfirmDialog("${entry.innerText}", ()=>{});`);
    })
}

function buildTable(title, id, data, convertTime) {
    const table = document.getElementById(id);
    //build new table
    //caption
    let caption = document.createElement("caption");
    caption.innerText = title;
    table.appendChild(caption);
    //thead
    let thead = document.createElement("thead");
    thead.innerHTML = "<tr><th>Key</th><th>Value</th></tr>";
    table.appendChild(thead);
    //entries
    let tbody = document.createElement("tbody");
    Object.entries(data).forEach(element => {
        let tr = document.createElement("tr");
        if(convertTime && element[0]!="totalTimeSpent"){
            tr.innerHTML = `<td>${element[0]}</td><td>${new Date(element[1]).toLocaleString("en-US",{ hour12:false})+":"+new Date(element[1]).getMilliseconds()}</td>`;
        }else if(convertTime && element[0]=="totalTimeSpent"){
            tr.innerHTML = `<td>${element[0]}</td><td>${element[1]} ms</td>`;
        }else{
            tr.innerHTML = `<td>${element[0]}</td><td>${element[1]}</td>`;
        }
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
}

function initSelectWithArray(selectid, entries) {
    //init select entries 
    if (entries != null) {
        let select = document.getElementById(selectid);
        for (let i = 0; i <= entries.length; i++) {
            //create an entry in select
            let option = document.createElement('option');
            if (i == 0){
                option.setAttribute("selected", "");
                option.setAttribute('value', "");
                option.setAttribute('disabled', "");
                option.innerText = "--Select an option--";
            }else{
                option.setAttribute('value', entries[i-1]);
                option.innerText = entries[i-1];
            }
            select.appendChild(option)
        }
    } else {
        let select = document.getElementById(selectid);
        //create an entry in select
        let option = document.createElement('option');
        option.setAttribute('disabled', "");
        option.setAttribute('value', "");
        option.innerText = "No entry data can be found"
        select.appendChild(option);
    }
}

function responseStr2array(str){
    return str.split(',');
}