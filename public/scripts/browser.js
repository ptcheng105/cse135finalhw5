var data = [
            {
                "page": "https://cse135winter2020hw3.firebaseapp.com/index.html",
                "time": 1582345630868,
                "staticData": {
                    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
                    "user_language": "en-US",
                }
            },
            {
                "page": "1111111111111111",
                "time": 15823456301111,
                "staticData": {
                    "user_agent": "11111ws NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
                    "user_language": "en-US",
                }
            },
            {
                "page": "12222111111111",
                "time": 1582345632222,
                "staticData": {
                    "user_agent": "222222s NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
                    "user_language": "en-US",
                }
            },
            {
                "page": "13333111111111",
                "time": 1582345633333,
                "staticData": {
                    "user_agent": "3333333ws NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
                    "user_language": "en-US",
                }
            }
        ]

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
                pageSize: 2,

            });