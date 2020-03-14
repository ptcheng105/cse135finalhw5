function generateNewDataTable() {
    console.log("yes");
    //get data
    let xhr_getallsessiondata = new XMLHttpRequest();
    xhr_getallsessiondata.open("GET", "https://cse135hw5timeben.firebaseapp.com/getAllSessionsData", true);
    xhr_getallsessiondata.onreadystatechange = function () {
        if (xhr_getallsessiondata.readyState === XMLHttpRequest.DONE && xhr_getallsessiondata.status === 200) {
            ret_data = JSON.parse(xhr_getallsessiondata.responseText);
            let data = [];
            ret_data.forEach(element => {
                data.push(JSON.parse(element.Report));
            });
            console.log(data);
            //create table with new data
            // prepare the data
            var source =
            {
                dataType: "json",
                localData: data
            };
            // initialize the row details.
            var initRowDetails = function (id, row, element, rowinfo) {
                // update the details height.
                rowinfo.detailsHeight = 250;
                element.append($("<div style='margin: 10px;'></div>"));
                detailsdiv = $(element.children()[0]);
                //show information
                console.log(row.staticData)
                for (key in row.staticData) {
                    let value = row.staticData[key];
                    let linecontainer = $('<span>' + key + " : " + value + "</span></br>");
                    $(detailsdiv).append(linecontainer);
                }

            }
            var dataAdapter = new $.jqx.dataAdapter(source);
            $("#dataTable").jqxDataTable(
                {
                    source: dataAdapter,
                    columns: [
                        { text: 'From Page', dataField: 'page', width: 450 },
                        { text: 'Time', dataField: 'time', width: 150 },
                    ],
                    pageable: true,
                    sortable: true,
                    filterable: true,
                    rowDetails: true,
                    initRowDetails: initRowDetails,
                    enableBrowserSelection: true,
                    pageSize: 10,

                }
            );
        }
    };
    xhr_getallsessiondata.send();
}

generateNewDataTable();