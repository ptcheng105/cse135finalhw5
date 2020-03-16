function initSelectEntries() {
    //read local storage for reports
    let reports = JSON.parse(localStorage.getItem('page_reports'));
    //init select entries 
    if (reports != null) {
        let select = document.getElementById('select_report');
        for (let i = 0; i < reports.length; i++) {
            //create an entry in select
            let option = document.createElement('option');
            option.setAttribute('value', i);
            option.innerText = reports[i].page + " at " + new Date(reports[i].time)
            if (i == 0) option.setAttribute("selected", "")
            select.appendChild(option)
        }
    } else {
        let select = document.getElementById('select_report');
        //create an entry in select
        let option = document.createElement('option');
        option.setAttribute('disabled', "");
        option.setAttribute('value', "");
        option.innerText = "No report can be found"
        select.appendChild(option);
        document.getElementById('btn_show_report').setAttribute('disabled', "");
        document.getElementById('btn_clear_all_report').setAttribute('disabled', "");
        document.getElementById('btn_delete_one_report').setAttribute('disabled', "");
    }
}

function showSelectedReport() {
    //read local storage for reports
    let reports = JSON.parse(localStorage.getItem('page_reports'));
    if (document.getElementById("select_report").selectedIndex < 0) return;
    let reportObj = reports[document.getElementById("select_report").selectedIndex];
    buildTable("Static Data", "static_table", reportObj.staticData, false);
    buildTable("Page Load Data", "page_load_table", reportObj.pageLoadInfo, true);
    buildActionList(reportObj.pageLoadInfo.endTime, reportObj.dynamicData.events_list);
}

function buildTable(title, id, data, convertTime) {
    //remove old table if exist
    const table = document.getElementById(id);
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
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

function createConfirmDialog(prompt, functionForConfirm) {
    let dialog = document.createElement("dialog");
    dialog.innerHTML = `<p>${prompt}</p><button id="btn_cancel">cancel</button><button id="btn_confirm">confirm</button>`;
    document.querySelector("body").appendChild(dialog);
    document.getElementById("btn_cancel").addEventListener('click', () => {
        dialog.close();
        dialog.parentElement.removeChild(dialog);
    })
    document.getElementById("btn_confirm").addEventListener('click', () => {
        functionForConfirm();
        dialog.close();
        dialog.parentElement.removeChild(dialog);
    })
    dialog.showModal();
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
        }
        entry.setAttribute("onclick", `createConfirmDialog("${entry.innerText}", ()=>{});`);
    })
}

initSelectEntries()
document.getElementById("btn_show_report").addEventListener("click", () => { showSelectedReport() })

document.getElementById("btn_clear_all_report").addEventListener("click", () => {
    createConfirmDialog("Sure to purge all local storage data?", () => {
        localStorage.clear();
        location.reload();
    })
})
document.getElementById("btn_delete_one_report").addEventListener("click", () => {
    createConfirmDialog("Sure to delete the selected report?", () => {
        //read local storage for reports
        let reports = JSON.parse(localStorage.getItem('page_reports'));
        if (document.getElementById("select_report").selectedIndex < 0) return;
        if (reports.length <= 1) { localStorage.removeItem('page_reports'); }
        else {
            reports.splice(document.getElementById("select_report").selectedIndex, 1);
            localStorage.setItem('page_reports', JSON.stringify(reports))
        }
        location.reload();
    })
})