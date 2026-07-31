/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.97427983539094, "KoPercent": 0.0257201646090535};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9733796296296297, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get User By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Post"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quote By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Paginated"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "Update User (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Login (alias: /user/login)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Users"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "Delete User"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Quote"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Generate 2FA TOTP Code"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "Get Product Categories"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Quotes"], "isController": false}, {"data": [1.0, 500, 1500, "Update Product (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todo By Id"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "Get Caller IP Address"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "Get Products - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Meal Type"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Recipes"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "Get Products By Category"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "Mock 200 OK - PATCH"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "Get Posts - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product By Id"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "Add New User"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "Test Route - PUT"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Filter Users"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Carts"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "Get Posts - Field Selection"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "Update Post (PUT)"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "Get Posts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe By Id"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "Get Products - Paginated"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "Get Posts By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (alias: /user/me)"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "Get Products - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Square Image"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (me)"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Cart"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "Test Route - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Background Color"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image - Custom Format"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "Test Route - POST"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "Test Route - DELETE"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "Get Post By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - GET"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "Search Products"], "isController": false}, {"data": [1.0, 500, 1500, "Create Custom Mock Response"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quotes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - GET"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "Get Post Tags"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "Search Posts"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "Get Comments For Post"], "isController": false}, {"data": [1.0, 500, 1500, "Search Users"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Cart By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comment By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Comment"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "Get Post Tag List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts By User Id"], "isController": false}, {"data": [0.9861111111111112, 500, 1500, "Login (get access + refresh token)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Cart"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "Mock 200 OK - DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Text + Colors"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 201 Created - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Refresh Token"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "Get Posts By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments By Post Id"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PUT"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Identicon"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Field Selection"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "Get Product Category List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Products"], "isController": false}, {"data": [1.0, 500, 1500, "Update Product (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments - Paginated"], "isController": false}, {"data": [0.0, 500, 1500, "Get Products - Simulate Delay (perf testing)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Sized Image"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Search Recipes"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "Update Post (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos - Paginated"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3888, 1, 0.0257201646090535, 184.86754115226375, 9, 6838, 92.0, 121.0, 142.0, 3859.1200000000117, 14.444886146209889, 92.77114449506986, 8.156204023799882], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get User By Id", 36, 0, 0.0, 94.8888888888889, 80, 148, 87.0, 119.0, 127.59999999999997, 148.0, 0.26147018876695016, 0.6354114274274966, 0.13762932787635365], "isController": false}, {"data": ["Add New Post", 36, 0, 0.0, 96.66666666666666, 78, 131, 91.5, 120.60000000000001, 126.75, 131.0, 0.2542714064740325, 0.2879728521129248, 0.17505990387128217], "isController": false}, {"data": ["Delete Recipe", 36, 0, 0.0, 97.02777777777776, 78, 139, 92.0, 118.0, 136.45, 139.0, 0.2614663906743654, 0.4811636956640157, 0.14375544721647238], "isController": false}, {"data": ["Get Quote By Id", 36, 0, 0.0, 95.8888888888889, 78, 137, 89.0, 118.60000000000001, 124.24999999999997, 137.0, 0.25875452820424355, 0.29125326587746536, 0.1364525832327066], "isController": false}, {"data": ["Add New Product", 36, 0, 0.0, 94.16666666666666, 78, 139, 85.0, 118.0, 121.99999999999997, 139.0, 0.26106441764505395, 0.3099715050001088, 0.29650187277460716], "isController": false}, {"data": ["Get Recipes - Paginated", 36, 0, 0.0, 98.55555555555554, 80, 216, 89.5, 119.0, 134.39999999999986, 216.0, 0.2614910802487071, 2.473539349867802, 0.1417261225957348], "isController": false}, {"data": ["Update User (PUT)", 36, 0, 0.0, 314.6666666666667, 79, 4040, 95.0, 124.50000000000003, 3955.85, 4040.0, 0.25453748417978833, 0.6172313038682627, 0.1456630524700742], "isController": false}, {"data": ["Update User (PATCH)", 36, 0, 0.0, 97.24999999999999, 80, 122, 88.0, 120.0, 120.3, 122.0, 0.25452668641605214, 0.6170532217068843, 0.1506280976251246], "isController": false}, {"data": ["Login (alias: /user/login)", 36, 0, 0.0, 94.97222222222223, 79, 121, 90.5, 117.60000000000001, 120.15, 121.0, 0.26276796858462953, 0.7457352667459838, 0.16628285511996088], "isController": false}, {"data": ["Get All Posts", 36, 0, 0.0, 11.916666666666668, 9, 14, 12.0, 14.0, 14.0, 14.0, 0.2546202974813809, 3.9074518210655858, 0.13352646459716946], "isController": false}, {"data": ["Get Recipes - Sorted", 36, 0, 0.0, 102.61111111111111, 82, 211, 94.5, 125.9, 155.74999999999991, 211.0, 0.261481583706792, 7.345799634288952, 0.14325309419874055], "isController": false}, {"data": ["Update Todo (PUT)", 36, 0, 0.0, 95.33333333333333, 78, 119, 89.0, 118.0, 119.0, 119.0, 0.25884569201676744, 0.287044593360608, 0.14812849172053294], "isController": false}, {"data": ["Update Recipe (PUT)", 36, 0, 0.0, 93.47222222222223, 78, 119, 91.5, 118.0, 119.0, 119.0, 0.26150437656630227, 0.46601748356517636, 0.16829236734100897], "isController": false}, {"data": ["Get All Users", 36, 0, 0.0, 17.083333333333332, 11, 102, 12.5, 32.70000000000004, 48.44999999999991, 102.0, 0.2616088947024199, 10.985657496729887, 0.13719138325703073], "isController": false}, {"data": ["Delete User", 36, 0, 0.0, 302.36111111111114, 79, 4094, 93.0, 119.0, 3578.899999999999, 4094.0, 0.254499696014252, 0.6319205912346063, 0.13942805611718295], "isController": false}, {"data": ["Get Random Quote", 36, 0, 0.0, 98.19444444444444, 77, 157, 91.5, 122.90000000000006, 137.44999999999996, 157.0, 0.25874708909524763, 0.29506320885921283, 0.13771207378604491], "isController": false}, {"data": ["Update Comment (PUT)", 36, 0, 0.0, 95.52777777777779, 78, 120, 89.0, 119.0, 120.0, 120.0, 0.259063628905744, 0.29942988011110955, 0.15634894791381818], "isController": false}, {"data": ["Generate 2FA TOTP Code", 36, 0, 0.0, 101.8611111111111, 78, 194, 92.5, 124.00000000000004, 186.35, 194.0, 0.258657853139819, 0.2747117042678546, 0.14044313119701105], "isController": false}, {"data": ["Get Product Categories", 36, 0, 0.0, 327.77777777777777, 81, 4160, 93.0, 190.10000000000096, 4146.4, 4160.0, 0.25467433519387084, 0.8896054183733384, 0.13703667840998324], "isController": false}, {"data": ["Get All Todos", 36, 0, 0.0, 97.30555555555556, 79, 123, 92.5, 120.30000000000001, 122.15, 123.0, 0.2589965323242061, 0.8926050194966835, 0.1358214236895495], "isController": false}, {"data": ["Get All Quotes", 36, 0, 0.0, 97.0277777777778, 80, 124, 90.5, 119.30000000000001, 121.44999999999999, 124.0, 0.2588010323285623, 1.2496079793390509, 0.13597163612574853], "isController": false}, {"data": ["Update Product (PUT)", 36, 0, 0.0, 106.83333333333333, 95, 380, 99.0, 102.60000000000001, 152.19999999999962, 380.0, 0.26104359428024476, 0.40244220784871076, 0.15193552948342376], "isController": false}, {"data": ["Get Todo By Id", 36, 0, 0.0, 95.25, 77, 149, 88.0, 118.0, 122.64999999999995, 149.0, 0.2589443701178197, 0.28747011575172987, 0.13629981981787578], "isController": false}, {"data": ["Get Caller IP Address", 36, 0, 0.0, 235.02777777777771, 79, 5087, 90.5, 121.60000000000005, 883.749999999993, 5087.0, 0.2547157796425488, 0.2785470167298739, 0.13283029914953232], "isController": false}, {"data": ["Get Products - Field Selection", 36, 0, 0.0, 213.72222222222223, 80, 4260, 92.0, 124.30000000000001, 745.2499999999941, 4260.0, 0.2547554347826087, 0.8200908052748528, 0.14130965523097824], "isController": false}, {"data": ["Get Recipes By Meal Type", 36, 0, 0.0, 98.3611111111111, 82, 124, 94.0, 122.0, 123.15, 124.0, 0.2615024770095739, 6.405881410896663, 0.1419876730637921], "isController": false}, {"data": ["Get All Recipes", 36, 0, 0.0, 100.91666666666666, 83, 157, 95.5, 123.30000000000001, 129.79999999999995, 157.0, 0.26149487905861846, 7.268016929069515, 0.13764232403573765], "isController": false}, {"data": ["Get Products By Category", 36, 0, 0.0, 192.13888888888889, 81, 3540, 92.0, 120.0, 635.5499999999952, 3540.0, 0.2546779385235754, 2.108609529199533, 0.13828216193272258], "isController": false}, {"data": ["Mock 200 OK - PATCH", 36, 1, 2.7777777777777777, 224.66666666666669, 78, 4781, 90.5, 119.0, 819.1499999999934, 4781.0, 0.24975198240636035, 0.25744155760251974, 0.14438786482867708], "isController": false}, {"data": ["Get Posts - Sorted", 36, 0, 0.0, 632.0555555555557, 81, 4073, 97.5, 3842.000000000001, 4039.0, 4073.0, 0.2544637177149158, 3.3811700824886555, 0.13915984562534459], "isController": false}, {"data": ["Get Product By Id", 36, 0, 0.0, 12.333333333333332, 10, 19, 12.0, 14.300000000000004, 15.599999999999994, 19.0, 0.25489973943582195, 0.6479808046335108, 0.1349176355216948], "isController": false}, {"data": ["Add New User", 36, 0, 0.0, 306.5, 78, 3958, 91.5, 118.30000000000001, 3832.2, 3958.0, 0.25457168314311174, 0.45199180243823106, 0.15736706584920873], "isController": false}, {"data": ["Test Route - PUT", 36, 0, 0.0, 363.58333333333337, 78, 5062, 86.5, 119.20000000000002, 4874.15, 5062.0, 0.2547410133031418, 0.26682711443886215, 0.14677460727427116], "isController": false}, {"data": ["Get User's Todos", 36, 0, 0.0, 96.16666666666669, 78, 123, 91.5, 118.0, 120.44999999999999, 123.0, 0.2614644916694508, 0.3126027019813198, 0.13915834761704166], "isController": false}, {"data": ["Get User's Posts", 36, 0, 0.0, 94.55555555555557, 78, 119, 86.0, 118.0, 119.0, 119.0, 0.26148918088514084, 0.42072065691893107, 0.13917148787343925], "isController": false}, {"data": ["Filter Users", 36, 0, 0.0, 104.11111111111111, 82, 213, 90.0, 141.90000000000006, 181.54999999999995, 213.0, 0.26148918088514084, 8.422073954224865, 0.14581086160685103], "isController": false}, {"data": ["Get All Carts", 36, 0, 0.0, 97.66666666666669, 80, 121, 93.5, 120.0, 121.0, 121.0, 0.2615860836203514, 7.951950133336239, 0.13717942080481316], "isController": false}, {"data": ["Get Posts - Field Selection", 36, 0, 0.0, 288.3888888888889, 79, 3847, 94.0, 121.30000000000001, 3283.449999999999, 3847.0, 0.2544547247294652, 1.1030650971168865, 0.14089436418125656], "isController": false}, {"data": ["Update Post (PUT)", 36, 0, 0.0, 177.69444444444446, 78, 2952, 91.5, 120.9, 615.349999999996, 2952.0, 0.25424985698445546, 0.36998789002634314, 0.1529471795922115], "isController": false}, {"data": ["Get Posts - Paginated", 36, 0, 0.0, 411.02777777777777, 80, 3651, 94.5, 2152.600000000001, 3645.9, 3651.0, 0.25448710245226597, 1.5214689251807918, 0.13743297622666317], "isController": false}, {"data": ["Get Recipe By Id", 36, 0, 0.0, 94.72222222222223, 78, 126, 91.0, 118.30000000000001, 122.6, 126.0, 0.2614910802487071, 0.46677406262711374, 0.1381510492329595], "isController": false}, {"data": ["Get Products - Paginated", 36, 0, 0.0, 902.7777777777779, 84, 4939, 108.0, 4738.200000000001, 4903.3, 4939.0, 0.2547500265364611, 4.12232866291618, 0.1383213034709691], "isController": false}, {"data": ["Get Posts By User Id", 36, 0, 0.0, 264.58333333333337, 78, 3194, 91.0, 130.50000000000014, 3066.5, 3194.0, 0.2543899939935696, 0.4092225757870191, 0.13514468430908386], "isController": false}, {"data": ["Get Carts - Paginated", 36, 0, 0.0, 99.44444444444446, 80, 217, 91.0, 120.30000000000001, 135.39999999999986, 217.0, 0.2615651769561079, 2.905527630546453, 0.14125541294602312], "isController": false}, {"data": ["Get Recipe Tags", 36, 0, 0.0, 95.69444444444443, 78, 134, 90.0, 117.60000000000001, 121.24999999999997, 134.0, 0.26150437656630227, 0.51356695828642, 0.13892420005084807], "isController": false}, {"data": ["Get Authenticated User (alias: /user/me)", 36, 0, 0.0, 95.22222222222223, 80, 122, 87.5, 118.30000000000001, 120.3, 122.0, 0.2627583790727549, 0.638021593629569, 0.13830738898458483], "isController": false}, {"data": ["Get Products - Sorted", 36, 0, 0.0, 479.4444444444444, 85, 4962, 98.5, 1402.3000000000177, 4570.999999999999, 4962.0, 0.2547554347826087, 10.60586044753807, 0.1400657322095788], "isController": false}, {"data": ["Generate Square Image", 36, 0, 0.0, 118.72222222222221, 93, 170, 119.0, 148.20000000000002, 157.24999999999997, 170.0, 0.25850555068863007, 0.8102631528162744, 0.13657373332280162], "isController": false}, {"data": ["Get Authenticated User (me)", 36, 0, 0.0, 96.0, 79, 126, 90.5, 119.0, 126.0, 126.0, 0.26267977146859883, 0.6382012546607417, 0.1382660125210691], "isController": false}, {"data": ["Delete Product", 36, 0, 0.0, 96.38888888888889, 81, 121, 91.5, 119.0, 121.0, 121.0, 0.261603191558937, 0.6720045526222087, 0.14408613285082078], "isController": false}, {"data": ["Get Random Todo", 36, 0, 0.0, 95.11111111111111, 77, 121, 89.5, 117.0, 120.15, 121.0, 0.25891643472069387, 0.28285974325918256, 0.13754935594536863], "isController": false}, {"data": ["Delete Cart", 36, 0, 0.0, 96.22222222222224, 80, 127, 93.0, 118.0, 120.19999999999999, 127.0, 0.2615119750691917, 0.5432843179985617, 0.14326974415411772], "isController": false}, {"data": ["Test Route - PATCH", 36, 0, 0.0, 203.94444444444443, 79, 4087, 85.0, 118.0, 714.1999999999944, 4087.0, 0.2547301982650043, 0.2673824061920666, 0.14726589587195563], "isController": false}, {"data": ["Get All Comments", 36, 0, 0.0, 99.5277777777778, 80, 212, 93.0, 119.30000000000001, 133.79999999999987, 212.0, 0.25918299759535773, 1.3023692520770638, 0.13667853388817694], "isController": false}, {"data": ["Add New Cart", 36, 0, 0.0, 96.19444444444444, 79, 120, 91.5, 118.0, 118.3, 120.0, 0.2615385733070826, 0.4177210318786461, 0.18517135317151845], "isController": false}, {"data": ["Generate Image With Background Color", 36, 0, 0.0, 124.80555555555557, 100, 161, 120.0, 147.10000000000002, 160.15, 161.0, 0.25837753263810637, 1.8409819736813775, 0.13928163868772922], "isController": false}, {"data": ["Get User's Carts", 36, 0, 0.0, 98.58333333333333, 79, 140, 93.0, 121.0, 123.84999999999997, 140.0, 0.2614910802487071, 0.5394388474054274, 0.139172498765181], "isController": false}, {"data": ["Generate Image - Custom Format", 36, 0, 0.0, 131.47222222222223, 102, 174, 127.0, 151.9, 161.24999999999997, 174.0, 0.2582774330092908, 0.657744287405388, 0.14427215984503355], "isController": false}, {"data": ["Test Route - POST", 36, 0, 0.0, 213.36111111111111, 79, 4401, 87.0, 119.0, 762.149999999994, 4401.0, 0.2547518292596629, 0.26746730684857833, 0.1450393715413901], "isController": false}, {"data": ["Test Route - DELETE", 36, 0, 0.0, 477.19444444444446, 79, 4769, 85.5, 1460.500000000019, 4729.05, 4769.0, 0.2547229887497347, 0.2676857797353711, 0.1388041286351093], "isController": false}, {"data": ["Get Post By Id", 36, 0, 0.0, 178.83333333333334, 78, 3116, 88.5, 117.0, 567.6999999999957, 3116.0, 0.2544331441575789, 0.37247013502625603, 0.13392525849700687], "isController": false}, {"data": ["Test Route - GET", 36, 0, 0.0, 94.22222222222223, 77, 146, 84.5, 118.0, 122.19999999999996, 146.0, 0.262769886570999, 0.2759568519072714, 0.13754361250200725], "isController": false}, {"data": ["Search Products", 36, 0, 0.0, 551.4444444444443, 83, 4198, 95.0, 2948.900000000001, 4095.1499999999996, 4198.0, 0.25467433519387084, 9.53761050257504, 0.1380315000318343], "isController": false}, {"data": ["Create Custom Mock Response", 36, 0, 0.0, 110.44444444444444, 86, 170, 103.0, 140.20000000000002, 148.74999999999997, 170.0, 0.2585686787140518, 0.27690359967104317, 0.16488803437526933], "isController": false}, {"data": ["Delete Todo", 36, 0, 0.0, 94.41666666666666, 77, 128, 85.5, 117.0, 118.64999999999998, 128.0, 0.2588121958058046, 0.30173693986929984, 0.14179066586626599], "isController": false}, {"data": ["Get Quotes - Paginated", 36, 0, 0.0, 96.94444444444444, 79, 124, 91.5, 119.0, 121.44999999999999, 124.0, 0.2587582479191524, 0.6018880816669782, 0.1399922552218852], "isController": false}, {"data": ["Mock 200 OK - GET", 36, 0, 0.0, 98.91666666666666, 79, 132, 92.5, 119.60000000000001, 132.0, 132.0, 0.2581903723678926, 0.27052417352186015, 0.13615507917838088], "isController": false}, {"data": ["Get Post Tags", 36, 0, 0.0, 185.4166666666667, 79, 3225, 93.5, 121.30000000000001, 589.9999999999956, 3225.0, 0.2543378737353756, 3.7740307342593113, 0.13462024176227885], "isController": false}, {"data": ["Search Posts", 36, 0, 0.0, 266.11111111111103, 78, 3318, 92.5, 118.0, 3057.8999999999996, 3318.0, 0.2544097693351425, 0.3871840084909261, 0.13714276628222524], "isController": false}, {"data": ["Get Comments For Post", 36, 0, 0.0, 372.9166666666668, 77, 3738, 86.5, 959.2000000000119, 3698.0499999999997, 3738.0, 0.25436303257259946, 0.3704768865258249, 0.13612396665018017], "isController": false}, {"data": ["Search Users", 36, 0, 0.0, 99.0, 78, 143, 97.0, 123.50000000000006, 139.6, 143.0, 0.2614625926921205, 0.2771514830739285, 0.14094467887309622], "isController": false}, {"data": ["Update Comment (PATCH)", 36, 0, 0.0, 95.77777777777777, 78, 119, 91.5, 117.30000000000001, 118.15, 119.0, 0.25904125951616847, 0.2976753970167082, 0.1479874382978111], "isController": false}, {"data": ["Get Cart By Id", 36, 0, 0.0, 94.69444444444444, 78, 121, 90.5, 118.0, 119.3, 121.0, 0.2615746795710175, 0.524227900572558, 0.13768432840701023], "isController": false}, {"data": ["Get Comment By Id", 36, 0, 0.0, 95.13888888888889, 77, 118, 91.5, 117.0, 118.0, 118.0, 0.2591419522027066, 0.29817070976101356, 0.13716302548229198], "isController": false}, {"data": ["Add New Recipe", 36, 0, 0.0, 94.97222222222221, 78, 119, 92.0, 117.30000000000001, 118.15, 119.0, 0.26149677850496483, 0.3486410906776398, 0.26277361824375856], "isController": false}, {"data": ["Add New Comment", 36, 0, 0.0, 95.33333333333331, 78, 118, 92.0, 117.30000000000001, 118.0, 118.0, 0.2590878667712614, 0.296843401175971, 0.16446007168097646], "isController": false}, {"data": ["Get Post Tag List", 36, 0, 0.0, 580.3611111111111, 79, 3849, 92.5, 3435.7000000000007, 3832.85, 3849.0, 0.2543163129786092, 0.6743204213350193, 0.13560225281867247], "isController": false}, {"data": ["Get Carts By User Id", 36, 0, 0.0, 96.77777777777779, 79, 124, 92.0, 120.30000000000001, 121.44999999999999, 124.0, 0.2615442736334312, 0.5397614271235942, 0.1389453953677603], "isController": false}, {"data": ["Login (get access + refresh token)", 36, 0, 0.0, 126.38888888888891, 79, 525, 111.0, 149.3, 410.24999999999983, 525.0, 0.2618048535710909, 0.7429167242394933, 0.06749656381129687], "isController": false}, {"data": ["Update Cart", 36, 0, 0.0, 96.55555555555556, 79, 123, 92.0, 120.0, 122.15, 123.0, 0.26152527351184857, 0.5895953350429337, 0.16932739876792538], "isController": false}, {"data": ["Mock 200 OK - DELETE", 36, 0, 0.0, 204.44444444444446, 77, 4035, 90.5, 118.30000000000001, 719.9999999999944, 4035.0, 0.2497104052938606, 0.26161879539006844, 0.13704809353041958], "isController": false}, {"data": ["Generate Image With Text + Colors", 36, 0, 0.0, 128.52777777777774, 94, 186, 129.5, 163.0, 176.64999999999998, 186.0, 0.2583182049754957, 1.6116928565150004, 0.1453039902987163], "isController": false}, {"data": ["Update Todo (PATCH)", 36, 0, 0.0, 94.69444444444443, 77, 120, 88.5, 118.0, 118.3, 120.0, 0.2588196386590267, 0.28694549240436257, 0.14887184293961594], "isController": false}, {"data": ["Mock 201 Created - POST", 36, 0, 0.0, 97.41666666666667, 78, 148, 91.0, 123.20000000000002, 130.14999999999998, 148.0, 0.25819963134830415, 0.273244466638456, 0.14901951379574976], "isController": false}, {"data": ["Refresh Token", 36, 0, 0.0, 95.11111111111111, 79, 121, 90.0, 119.0, 120.15, 121.0, 0.2627449549319418, 0.7013231899791994, 0.25119854577965917], "isController": false}, {"data": ["Get Posts By Tag", 36, 0, 0.0, 366.88888888888886, 80, 3567, 95.5, 1008.3000000000112, 3466.7, 3567.0, 0.25428936717265543, 3.6436553919941232, 0.13633287361112092], "isController": false}, {"data": ["Get Recipes By Tag", 36, 0, 0.0, 94.27777777777777, 79, 119, 91.0, 118.0, 118.15, 119.0, 0.2614986779789058, 0.4779813346238777, 0.14019802168986256], "isController": false}, {"data": ["Update Recipe (PATCH)", 36, 0, 0.0, 97.05555555555556, 79, 139, 92.0, 120.30000000000001, 125.39999999999998, 139.0, 0.2614549970586313, 0.46677348419649795, 0.14962170730113078], "isController": false}, {"data": ["Get Users - Sorted", 36, 0, 0.0, 102.2777777777778, 84, 213, 94.0, 125.30000000000001, 139.04999999999987, 213.0, 0.26144930062312083, 10.94026740226517, 0.14400137260882828], "isController": false}, {"data": ["Get Comments By Post Id", 36, 0, 0.0, 94.55555555555553, 77, 119, 87.5, 117.30000000000001, 119.0, 119.0, 0.25911583917543585, 0.37734306397282164, 0.13841441799703458], "isController": false}, {"data": ["Mock 200 OK - PUT", 36, 0, 0.0, 96.11111111111111, 78, 120, 91.5, 117.30000000000001, 118.3, 120.0, 0.25814964074174995, 0.27022939687997477, 0.14873856253675047], "isController": false}, {"data": ["Add New Todo", 36, 0, 0.0, 95.55555555555556, 78, 119, 92.0, 118.0, 119.0, 119.0, 0.25886802764135275, 0.28496268884782155, 0.16507892778301106], "isController": false}, {"data": ["Generate Identicon", 36, 0, 0.0, 104.02777777777779, 81, 151, 96.0, 136.3, 142.5, 151.0, 0.25823482153104554, 0.614694704572191, 0.1379437962670722], "isController": false}, {"data": ["Get Recipes - Field Selection", 36, 0, 0.0, 95.97222222222223, 79, 120, 93.0, 118.30000000000001, 119.15, 120.0, 0.26149297963986606, 0.9017478717376936, 0.1455576156198473], "isController": false}, {"data": ["Get Product Category List", 36, 0, 0.0, 321.08333333333337, 78, 4259, 91.0, 118.60000000000001, 4131.5, 4259.0, 0.2546851454888894, 0.345003583720667, 0.1377886431648874], "isController": false}, {"data": ["Get Todos By User Id", 36, 0, 0.0, 94.6388888888889, 78, 118, 89.0, 117.0, 117.15, 118.0, 0.25889036712092334, 0.30960939466398185, 0.13753550753299054], "isController": false}, {"data": ["Get All Products", 36, 0, 0.0, 13.25, 10, 18, 13.0, 16.0, 16.299999999999997, 18.0, 0.25485101834219415, 11.245467102981051, 0.13439409170389144], "isController": false}, {"data": ["Update Product (PATCH)", 36, 0, 0.0, 95.74999999999999, 78, 131, 89.5, 118.30000000000001, 127.6, 131.0, 0.2616088947024199, 0.4078697269457161, 0.15022073250490514], "isController": false}, {"data": ["Get Comments - Paginated", 36, 0, 0.0, 96.94444444444444, 80, 120, 93.0, 120.0, 120.0, 120.0, 0.25916247327386993, 0.6177324273445205, 0.1407171241604216], "isController": false}, {"data": ["Get Products - Simulate Delay (perf testing)", 36, 0, 0.0, 2813.8888888888887, 2085, 6838, 2100.0, 5876.400000000001, 6365.4, 6838.0, 0.2511984258231982, 11.077425373134329, 0.13516634045759982], "isController": false}, {"data": ["Get Users - Paginated", 36, 0, 0.0, 101.86111111111111, 80, 165, 96.0, 123.0, 139.49999999999994, 165.0, 0.26145309821921386, 3.859858813057403, 0.1411948860500247], "isController": false}, {"data": ["Generate Sized Image", 36, 0, 0.0, 131.63888888888889, 92, 235, 133.5, 160.0, 172.0999999999999, 235.0, 0.25842575643372456, 1.8371054072000286, 0.13754105200818348], "isController": false}, {"data": ["Delete Post", 36, 0, 0.0, 95.47222222222224, 78, 118, 91.0, 118.0, 118.0, 118.0, 0.2592016588906169, 0.39328845454610906, 0.14200403382581647], "isController": false}, {"data": ["Get Users - Field Selection", 36, 0, 0.0, 98.02777777777776, 81, 161, 92.5, 120.30000000000001, 129.54999999999995, 161.0, 0.2614644916694508, 0.7395819337114884, 0.1447757488052525], "isController": false}, {"data": ["Delete Comment", 36, 0, 0.0, 94.88888888888889, 78, 120, 88.0, 117.30000000000001, 119.15, 120.0, 0.2590207576357161, 0.3114938212756772, 0.14266377666654673], "isController": false}, {"data": ["Search Recipes", 36, 0, 0.0, 96.30555555555557, 78, 154, 91.5, 117.30000000000001, 123.39999999999995, 154.0, 0.261500577480442, 0.27742583780063484, 0.1414758983634422], "isController": false}, {"data": ["Update Post (PATCH)", 36, 0, 0.0, 170.61111111111111, 78, 2805, 92.5, 117.30000000000001, 521.0499999999962, 2805.0, 0.2542372881355932, 0.3692730402542373, 0.1447464247881356], "isController": false}, {"data": ["Get Todos - Paginated", 36, 0, 0.0, 94.77777777777777, 78, 118, 88.0, 117.0, 118.0, 118.0, 0.2589741745198187, 0.4857873309474139, 0.1398561704193943], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 1, 100.0, 0.0257201646090535], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3888, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Mock 200 OK - PATCH", 36, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
