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

    var data = {"OkPercent": 99.95370370370371, "KoPercent": 0.046296296296296294};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9666666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9, 500, 1500, "Get User By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Post"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quote By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Paginated"], "isController": false}, {"data": [0.975, 500, 1500, "Update User (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PATCH)"], "isController": false}, {"data": [0.95, 500, 1500, "Login (alias: /user/login)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Users"], "isController": false}, {"data": [1.0, 500, 1500, "Delete User"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Quote"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PUT)"], "isController": false}, {"data": [0.9, 500, 1500, "Generate 2FA TOTP Code"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Categories"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Quotes"], "isController": false}, {"data": [0.925, 500, 1500, "Update Product (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todo By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Caller IP Address"], "isController": false}, {"data": [0.95, 500, 1500, "Get Products - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Meal Type"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products By Category"], "isController": false}, {"data": [0.9, 500, 1500, "Mock 200 OK - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product By Id"], "isController": false}, {"data": [0.975, 500, 1500, "Add New User"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PUT"], "isController": false}, {"data": [0.95, 500, 1500, "Get User's Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Posts"], "isController": false}, {"data": [0.95, 500, 1500, "Filter Users"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Carts"], "isController": false}, {"data": [0.85, 500, 1500, "Get Posts - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PUT)"], "isController": false}, {"data": [0.925, 500, 1500, "Get Posts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe By Id"], "isController": false}, {"data": [0.95, 500, 1500, "Get Products - Paginated"], "isController": false}, {"data": [0.95, 500, 1500, "Get Posts By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (alias: /user/me)"], "isController": false}, {"data": [0.95, 500, 1500, "Get Products - Sorted"], "isController": false}, {"data": [0.9, 500, 1500, "Generate Square Image"], "isController": false}, {"data": [0.9, 500, 1500, "Get Authenticated User (me)"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Cart"], "isController": false}, {"data": [0.975, 500, 1500, "Generate Image With Background Color"], "isController": false}, {"data": [0.95, 500, 1500, "Get User's Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image - Custom Format"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - DELETE"], "isController": false}, {"data": [0.9, 500, 1500, "Get Post By Id"], "isController": false}, {"data": [0.95, 500, 1500, "Test Route - GET"], "isController": false}, {"data": [0.875, 500, 1500, "Search Products"], "isController": false}, {"data": [1.0, 500, 1500, "Create Custom Mock Response"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quotes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tags"], "isController": false}, {"data": [0.95, 500, 1500, "Search Posts"], "isController": false}, {"data": [0.95, 500, 1500, "Get Comments For Post"], "isController": false}, {"data": [0.85, 500, 1500, "Search Users"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Cart By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comment By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tag List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts By User Id"], "isController": false}, {"data": [0.775, 500, 1500, "Login (get access + refresh token)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - DELETE"], "isController": false}, {"data": [0.95, 500, 1500, "Generate Image With Text + Colors"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 201 Created - POST"], "isController": false}, {"data": [0.95, 500, 1500, "Refresh Token"], "isController": false}, {"data": [0.975, 500, 1500, "Get Posts By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PATCH)"], "isController": false}, {"data": [0.875, 500, 1500, "Get Users - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments By Post Id"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PUT"], "isController": false}, {"data": [0.975, 500, 1500, "Add New Todo"], "isController": false}, {"data": [0.95, 500, 1500, "Generate Identicon"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Category List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Products"], "isController": false}, {"data": [1.0, 500, 1500, "Update Product (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments - Paginated"], "isController": false}, {"data": [0.0, 500, 1500, "Get Products - Simulate Delay (perf testing)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Paginated"], "isController": false}, {"data": [0.8, 500, 1500, "Generate Sized Image"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.95, 500, 1500, "Get Users - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Search Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos - Paginated"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2160, 1, 0.046296296296296294, 252.7814814814818, 6, 4756, 187.0, 195.0, 283.9499999999998, 2431.0199999999977, 7.7889764347402775, 50.02163604565206, 4.397991115698754], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get User By Id", 20, 0, 0.0, 393.9, 173, 2256, 188.5, 2050.5000000000045, 2256.0, 2256.0, 0.13992569945359015, 0.3397297597475741, 0.07365229688035653], "isController": false}, {"data": ["Add New Post", 20, 0, 0.0, 184.9, 173, 193, 186.0, 192.0, 192.95, 193.0, 0.14124792542109538, 0.16022811539955506, 0.09724588615417211], "isController": false}, {"data": ["Delete Recipe", 20, 0, 0.0, 186.10000000000002, 173, 195, 186.5, 191.0, 194.8, 195.0, 0.1421939098348418, 0.261739551413763, 0.07817887816114837], "isController": false}, {"data": ["Get Quote By Id", 20, 0, 0.0, 185.04999999999998, 173, 192, 186.0, 190.9, 191.95, 192.0, 0.14049383583295283, 0.15820648642478313, 0.07408854624003372], "isController": false}, {"data": ["Add New Product", 20, 0, 0.0, 185.40000000000003, 174, 192, 187.0, 190.0, 191.9, 192.0, 0.14167316001983427, 0.1681953717149536, 0.1609041846709641], "isController": false}, {"data": ["Get Recipes - Paginated", 20, 0, 0.0, 185.54999999999995, 176, 192, 187.0, 191.9, 192.0, 192.0, 0.14218885523752647, 1.3452815294899687, 0.07706524868830782], "isController": false}, {"data": ["Update User (PUT)", 20, 0, 0.0, 222.7, 174, 920, 187.0, 195.70000000000002, 883.7999999999995, 920.0, 0.13996193035494345, 0.33950335821156646, 0.0800954015507782], "isController": false}, {"data": ["Update User (PATCH)", 20, 0, 0.0, 187.29999999999998, 173, 213, 188.0, 192.8, 212.0, 213.0, 0.13995213636936168, 0.3394522666997887, 0.08282323695296208], "isController": false}, {"data": ["Login (alias: /user/login)", 20, 1, 5.0, 303.0, 178, 2357, 187.5, 345.10000000000036, 2257.2499999999986, 2357.0, 0.13956344554234354, 0.3794244883255178, 0.08831749288226427], "isController": false}, {"data": ["Get All Posts", 20, 0, 0.0, 7.800000000000001, 6, 11, 7.5, 9.900000000000002, 10.95, 11.0, 0.14010802328595348, 2.1503024144115113, 0.07347461768023145], "isController": false}, {"data": ["Get Recipes - Sorted", 20, 0, 0.0, 198.4, 177, 372, 189.0, 219.80000000000004, 364.4999999999999, 372.0, 0.1421858226516234, 3.9944912991163153, 0.07789672510503978], "isController": false}, {"data": ["Update Todo (PUT)", 20, 0, 0.0, 185.7, 174, 201, 185.5, 192.9, 200.6, 201.0, 0.140549125433067, 0.1559216860273087, 0.08043143310915747], "isController": false}, {"data": ["Update Recipe (PUT)", 20, 0, 0.0, 185.70000000000002, 172, 193, 187.0, 191.9, 192.95, 193.0, 0.1421949207974291, 0.25356242712510313, 0.09151020781787675], "isController": false}, {"data": ["Get All Users", 20, 0, 0.0, 7.950000000000002, 6, 12, 7.0, 10.0, 11.899999999999999, 12.0, 0.14237307440416866, 5.978570738951849, 0.07466244233890487], "isController": false}, {"data": ["Delete User", 20, 0, 0.0, 186.39999999999998, 173, 194, 188.0, 192.9, 193.95, 194.0, 0.13994332295420353, 0.3475623622432915, 0.07666816814190254], "isController": false}, {"data": ["Get Random Quote", 20, 0, 0.0, 185.6, 173, 193, 186.0, 191.0, 192.9, 193.0, 0.1404819937204549, 0.16052537192607838, 0.07476824861098429], "isController": false}, {"data": ["Update Comment (PUT)", 20, 0, 0.0, 184.95, 173, 193, 187.0, 190.9, 192.9, 193.0, 0.14117414536701747, 0.16305338059137847, 0.0852008025750164], "isController": false}, {"data": ["Generate 2FA TOTP Code", 20, 0, 0.0, 402.65, 175, 2595, 187.5, 1863.200000000004, 2567.3499999999995, 2595.0, 0.13866067652544076, 0.1475910199012736, 0.07528841420717292], "isController": false}, {"data": ["Get Product Categories", 20, 0, 0.0, 195.29999999999998, 175, 362, 187.5, 191.0, 353.4499999999999, 362.0, 0.1416681423764831, 0.4949115680892509, 0.07622963520453338], "isController": false}, {"data": ["Get All Todos", 20, 0, 0.0, 185.75, 173, 195, 187.0, 193.8, 194.95, 195.0, 0.14114923708837354, 0.4864686401682499, 0.07402064484028964], "isController": false}, {"data": ["Get All Quotes", 20, 0, 0.0, 184.9, 174, 194, 185.0, 191.9, 193.9, 194.0, 0.14051357712438964, 0.6784720026697579, 0.07382451610636877], "isController": false}, {"data": ["Update Product (PUT)", 20, 0, 0.0, 262.25000000000006, 176, 731, 185.5, 708.4000000000001, 730.0, 731.0, 0.14168018531768242, 0.21845590292782102, 0.08246229536068232], "isController": false}, {"data": ["Get Todo By Id", 20, 0, 0.0, 184.8, 173, 194, 186.0, 191.0, 193.85, 194.0, 0.14113031267420773, 0.15677317447940556, 0.07428636575331833], "isController": false}, {"data": ["Get Caller IP Address", 20, 0, 0.0, 185.10000000000002, 174, 192, 186.5, 191.8, 192.0, 192.0, 0.13961118285574675, 0.1525497582981397, 0.0728050504345398], "isController": false}, {"data": ["Get Products - Field Selection", 20, 0, 0.0, 283.55, 179, 2085, 189.5, 196.60000000000002, 1990.5999999999985, 2085.0, 0.13949627893675937, 0.4489968364859493, 0.07737684222273371], "isController": false}, {"data": ["Get Recipes By Meal Type", 20, 0, 0.0, 196.85000000000002, 174, 359, 189.0, 203.90000000000003, 351.2999999999999, 359.0, 0.14218683349921798, 3.483188628607991, 0.07720300725152851], "isController": false}, {"data": ["Get All Recipes", 20, 0, 0.0, 187.2, 176, 193, 188.0, 192.9, 193.0, 193.0, 0.1421827901950748, 3.951834580098675, 0.0748403553858841], "isController": false}, {"data": ["Get Products By Category", 20, 0, 0.0, 189.45000000000002, 176, 242, 187.0, 192.9, 239.54999999999995, 242.0, 0.14167617077645628, 1.1732557892425284, 0.07692573335127897], "isController": false}, {"data": ["Mock 200 OK - PATCH", 20, 0, 0.0, 411.05, 174, 2544, 184.5, 2154.0000000000045, 2535.3999999999996, 2544.0, 0.13870202643660623, 0.14546104120143696, 0.08018710903366298], "isController": false}, {"data": ["Get Posts - Sorted", 20, 0, 0.0, 189.3, 174, 236, 188.5, 194.9, 233.95, 236.0, 0.13992765740112362, 1.8592614180968439, 0.07652293764123948], "isController": false}, {"data": ["Get Product By Id", 20, 0, 0.0, 8.0, 6, 17, 8.0, 9.0, 16.599999999999994, 17.0, 0.13950406305583649, 0.3544138867575768, 0.0738390646252572], "isController": false}, {"data": ["Add New User", 20, 0, 0.0, 212.9, 173, 747, 186.0, 192.70000000000002, 719.2999999999996, 747.0, 0.13997074611406216, 0.24853008846151153, 0.08652488504902475], "isController": false}, {"data": ["Test Route - PUT", 20, 0, 0.0, 185.55, 175, 192, 187.0, 191.0, 191.95, 192.0, 0.13958974573727814, 0.14626933317978463, 0.08042768553222081], "isController": false}, {"data": ["Get User's Todos", 20, 0, 0.0, 304.9, 173, 2578, 187.0, 191.8, 2458.6999999999985, 2578.0, 0.13997858327675863, 0.16727030608066967, 0.07450032020100925], "isController": false}, {"data": ["Get User's Posts", 20, 0, 0.0, 185.04999999999998, 172, 191, 186.5, 190.9, 191.0, 191.0, 0.13998838096437996, 0.22525278839356333, 0.07450553479061238], "isController": false}, {"data": ["Filter Users", 20, 0, 0.0, 307.15000000000003, 174, 2173, 189.5, 367.9000000000001, 2082.9999999999986, 2173.0, 0.13991199535492174, 4.506170501567015, 0.07801733334732452], "isController": false}, {"data": ["Get All Carts", 20, 0, 0.0, 194.75000000000003, 177, 338, 188.0, 206.40000000000003, 331.4999999999999, 338.0, 0.1421858226516234, 4.322351811269648, 0.07456424488664236], "isController": false}, {"data": ["Get Posts - Field Selection", 20, 0, 0.0, 467.79999999999995, 173, 2424, 188.5, 2166.7000000000016, 2414.6, 2424.0, 0.13992080482446936, 0.606722025021338, 0.07747568001511146], "isController": false}, {"data": ["Update Post (PUT)", 20, 0, 0.0, 184.59999999999997, 172, 193, 186.0, 191.9, 192.95, 193.0, 0.14123994548138105, 0.20577722135124255, 0.08496465470364328], "isController": false}, {"data": ["Get Posts - Paginated", 20, 0, 0.0, 325.45, 173, 2032, 189.0, 1017.4000000000019, 1985.8499999999995, 2032.0, 0.13993744796076152, 0.8365635560904277, 0.0755716882053722], "isController": false}, {"data": ["Get Recipe By Id", 20, 0, 0.0, 185.85000000000002, 175, 205, 186.0, 190.9, 204.29999999999998, 205.0, 0.14218885523752647, 0.25412092184589574, 0.07512126043310725], "isController": false}, {"data": ["Get Products - Paginated", 20, 0, 0.0, 312.1000000000001, 176, 2507, 190.0, 338.00000000000034, 2399.3499999999985, 2507.0, 0.13963652612250313, 2.259813993238101, 0.07581827004307787], "isController": false}, {"data": ["Get Posts By User Id", 20, 0, 0.0, 297.99999999999994, 172, 2442, 186.5, 191.9, 2329.499999999998, 2442.0, 0.13990025112095075, 0.22515879771472938, 0.0743220084080051], "isController": false}, {"data": ["Get Carts - Paginated", 20, 0, 0.0, 186.25, 175, 192, 187.5, 191.9, 192.0, 192.0, 0.14218380099955213, 1.5795870493662156, 0.07678480659448468], "isController": false}, {"data": ["Get Recipe Tags", 20, 0, 0.0, 185.55, 176, 193, 187.0, 191.9, 192.95, 193.0, 0.1421827901950748, 0.2792281162913041, 0.07553460729113348], "isController": false}, {"data": ["Get Authenticated User (alias: /user/me)", 20, 0, 0.0, 196.0, 176, 367, 188.0, 194.8, 358.39999999999986, 367.0, 0.13957123715944617, 0.33912812028947076, 0.07346571955951318], "isController": false}, {"data": ["Get Products - Sorted", 20, 0, 0.0, 315.09999999999997, 178, 2312, 191.0, 343.9, 2213.5999999999985, 2312.0, 0.13949044141750186, 5.8073862041338, 0.07669249855278668], "isController": false}, {"data": ["Generate Square Image", 20, 0, 0.0, 422.85, 180, 2616, 195.5, 2118.6000000000045, 2601.75, 2616.0, 0.13863184234786888, 0.4346324869859358, 0.07324201827167683], "isController": false}, {"data": ["Get Authenticated User (me)", 20, 0, 0.0, 382.45000000000005, 177, 2251, 188.0, 1855.400000000004, 2240.45, 2251.0, 0.13954786491766677, 0.33909858620569355, 0.07345341717834218], "isController": false}, {"data": ["Delete Product", 20, 0, 0.0, 185.9, 175, 192, 187.0, 191.0, 191.95, 192.0, 0.1421827901950748, 0.36528758246601833, 0.07831161491213104], "isController": false}, {"data": ["Get Random Todo", 20, 0, 0.0, 185.05, 172, 195, 186.0, 191.9, 194.85, 195.0, 0.14112334180073385, 0.1549738260302004, 0.07497177533163986], "isController": false}, {"data": ["Delete Cart", 20, 0, 0.0, 185.05, 174, 191, 187.0, 191.0, 191.0, 191.0, 0.14218784436118556, 0.29552577065811647, 0.07789783270178233], "isController": false}, {"data": ["Test Route - PATCH", 20, 0, 0.0, 185.79999999999998, 176, 192, 186.5, 190.9, 191.95, 192.0, 0.13959559157121817, 0.14677985687961975, 0.08070370137711051], "isController": false}, {"data": ["Get All Comments", 20, 0, 0.0, 185.74999999999997, 174, 193, 187.5, 191.9, 192.95, 193.0, 0.1412130198404293, 0.7096505860340324, 0.07446780343147638], "isController": false}, {"data": ["Add New Cart", 20, 0, 0.0, 184.70000000000002, 175, 191, 186.0, 191.0, 191.0, 191.0, 0.14218885523752647, 0.2272244557721566, 0.1006708203586003], "isController": false}, {"data": ["Generate Image With Background Color", 20, 0, 0.0, 241.45, 186, 514, 199.0, 378.30000000000007, 507.44999999999993, 514.0, 0.13863953028927137, 0.9877254192112798, 0.07473537179656035], "isController": false}, {"data": ["Get User's Carts", 20, 0, 0.0, 299.59999999999997, 173, 2467, 187.0, 191.9, 2353.249999999998, 2467.0, 0.13999328032254452, 0.2889207021187983, 0.07450814235916675], "isController": false}, {"data": ["Generate Image - Custom Format", 20, 0, 0.0, 198.25, 188, 214, 198.5, 211.3, 213.9, 214.0, 0.1386539474778847, 0.35317489375641276, 0.07745122847397465], "isController": false}, {"data": ["Test Route - POST", 20, 0, 0.0, 195.25, 178, 367, 187.0, 191.9, 358.2499999999999, 367.0, 0.13958390039292867, 0.1466994078153026, 0.07947013079011468], "isController": false}, {"data": ["Test Route - DELETE", 20, 0, 0.0, 185.79999999999998, 176, 192, 187.0, 190.9, 191.95, 192.0, 0.13960046347353874, 0.14705763666885374, 0.07607134630686975], "isController": false}, {"data": ["Get Post By Id", 20, 0, 0.0, 414.1500000000001, 173, 2569, 186.5, 2171.0000000000045, 2560.1, 2569.0, 0.13991395291895484, 0.20514336807863165, 0.07364611388995768], "isController": false}, {"data": ["Test Route - GET", 20, 0, 0.0, 252.35, 175, 1527, 186.5, 190.9, 1460.1999999999991, 1527.0, 0.1395790296465859, 0.1463603350420133, 0.0730608983306348], "isController": false}, {"data": ["Search Products", 20, 0, 0.0, 485.55, 177, 2560, 189.5, 2409.4000000000033, 2559.95, 2560.0, 0.13932815961433964, 5.217791955627464, 0.07551477400972512], "isController": false}, {"data": ["Create Custom Mock Response", 20, 0, 0.0, 280.4, 270, 290, 280.5, 288.7, 289.95, 290.0, 0.13855884940731453, 0.14834186191917864, 0.08835832877243788], "isController": false}, {"data": ["Delete Todo", 20, 0, 0.0, 183.99999999999997, 173, 193, 184.0, 190.9, 192.9, 193.0, 0.14052641193912396, 0.16356780311547056, 0.07698761435336772], "isController": false}, {"data": ["Get Quotes - Paginated", 20, 0, 0.0, 185.15000000000003, 173, 193, 185.0, 192.0, 192.95, 193.0, 0.14050567994211166, 0.32679919718567124, 0.0760157682499315], "isController": false}, {"data": ["Mock 200 OK - GET", 20, 0, 0.0, 183.20000000000005, 174, 191, 182.5, 189.9, 190.95, 191.0, 0.13868182921332733, 0.14537214402107965, 0.07313299587421558], "isController": false}, {"data": ["Get Post Tags", 20, 0, 0.0, 185.99999999999997, 175, 193, 187.0, 192.8, 193.0, 193.0, 0.14126987490552576, 2.0963125030902785, 0.0747737033191357], "isController": false}, {"data": ["Search Posts", 20, 0, 0.0, 306.5000000000001, 173, 2618, 186.5, 193.8, 2496.7999999999984, 2618.0, 0.1399071016844815, 0.21300992859491297, 0.07541867200179081], "isController": false}, {"data": ["Get Comments For Post", 20, 0, 0.0, 254.90000000000003, 173, 1578, 186.0, 191.9, 1508.699999999999, 1578.0, 0.13989046576530575, 0.20406385081731004, 0.07486325706971442], "isController": false}, {"data": ["Search Users", 20, 0, 0.0, 510.05, 173, 2747, 187.0, 2463.7000000000016, 2736.6, 2747.0, 0.13991982593973654, 0.14822073358215743, 0.07542553117063923], "isController": false}, {"data": ["Update Comment (PATCH)", 20, 0, 0.0, 184.8, 173, 193, 186.5, 191.0, 192.9, 193.0, 0.14116617376144328, 0.1623273140665034, 0.08064669106488703], "isController": false}, {"data": ["Get Cart By Id", 20, 0, 0.0, 184.35000000000005, 175, 190, 186.0, 190.0, 190.0, 190.0, 0.14218683349921798, 0.28529010557372386, 0.07484248364851415], "isController": false}, {"data": ["Get Comment By Id", 20, 0, 0.0, 184.65, 172, 194, 186.0, 190.9, 193.85, 194.0, 0.14119806558650147, 0.1624329309188464, 0.07473569487098027], "isController": false}, {"data": ["Add New Recipe", 20, 0, 0.0, 186.04999999999998, 176, 193, 187.0, 191.8, 192.95, 193.0, 0.1421918879527923, 0.18987615975258612, 0.14288618428068678], "isController": false}, {"data": ["Add New Comment", 20, 0, 0.0, 184.5, 173, 193, 186.5, 190.0, 192.85, 193.0, 0.14118311449950588, 0.16167121099816462, 0.0896181879147254], "isController": false}, {"data": ["Get Post Tag List", 20, 0, 0.0, 185.6, 174, 195, 186.5, 192.8, 194.9, 195.0, 0.1412638880059896, 0.3746803904533864, 0.07532234653444367], "isController": false}, {"data": ["Get Carts By User Id", 20, 0, 0.0, 186.20000000000002, 174, 196, 187.0, 191.0, 195.75, 196.0, 0.14218481181840156, 0.29354776432156515, 0.07553568127852582], "isController": false}, {"data": ["Login (get access + refresh token)", 20, 0, 0.0, 610.05, 180, 2417, 205.5, 2365.9000000000005, 2415.5, 2417.0, 0.13873762633795098, 0.3938780179769279, 0.03576829429025299], "isController": false}, {"data": ["Update Cart", 20, 0, 0.0, 186.3, 176, 192, 188.0, 192.0, 192.0, 192.0, 0.14218481181840156, 0.3207350554876228, 0.09205911155820334], "isController": false}, {"data": ["Mock 200 OK - DELETE", 20, 0, 0.0, 185.29999999999998, 175, 195, 186.5, 190.0, 194.75, 195.0, 0.1387097221644265, 0.1455300683665543, 0.07612779673477314], "isController": false}, {"data": ["Generate Image With Text + Colors", 20, 0, 0.0, 308.40000000000003, 185, 2262, 194.5, 365.7000000000004, 2168.0499999999984, 2262.0, 0.13864625793749827, 0.8651106765417463, 0.07798852008984276], "isController": false}, {"data": ["Update Todo (PATCH)", 20, 0, 0.0, 184.9, 173, 195, 186.0, 190.9, 194.8, 195.0, 0.14053924909879206, 0.1558146577166588, 0.08083751730389505], "isController": false}, {"data": ["Mock 201 Created - POST", 20, 0, 0.0, 183.4, 174, 192, 182.0, 191.9, 192.0, 192.0, 0.1386885609674914, 0.1467742124223344, 0.08004388626151115], "isController": false}, {"data": ["Refresh Token", 20, 0, 0.0, 288.25000000000006, 176, 2219, 187.5, 193.9, 2117.7499999999986, 2219.0, 0.1395546810128879, 0.37232071366519437, 0.13342190694493872], "isController": false}, {"data": ["Get Posts By Tag", 20, 0, 0.0, 220.4, 173, 703, 188.0, 343.4000000000003, 685.8499999999997, 703.0, 0.14125490860807413, 2.0243456145647936, 0.07573139143147725], "isController": false}, {"data": ["Get Recipes By Tag", 20, 0, 0.0, 186.55, 173, 199, 187.0, 191.9, 198.65, 199.0, 0.1421858226516234, 0.2599473423692424, 0.07623048499584106], "isController": false}, {"data": ["Update Recipe (PATCH)", 20, 0, 0.0, 185.75000000000003, 172, 193, 187.0, 191.0, 192.9, 193.0, 0.14219694276573053, 0.25378821542836827, 0.08137442232492001], "isController": false}, {"data": ["Get Users - Sorted", 20, 0, 0.0, 461.4, 175, 2643, 190.0, 2313.2000000000035, 2634.2, 2643.0, 0.13992080482446936, 5.855125452119101, 0.07706575578222727], "isController": false}, {"data": ["Get Comments By Post Id", 20, 0, 0.0, 184.65000000000003, 173, 192, 186.0, 191.8, 192.0, 192.0, 0.141190091279394, 0.20591140851235062, 0.07542087883772318], "isController": false}, {"data": ["Mock 200 OK - PUT", 20, 0, 0.0, 183.6, 174, 191, 182.0, 191.0, 191.0, 191.0, 0.13869529337521933, 0.1454133466480815, 0.07991232723767519], "isController": false}, {"data": ["Add New Todo", 20, 0, 0.0, 213.04999999999998, 172, 731, 187.0, 196.5, 704.2999999999996, 731.0, 0.14056097886665683, 0.15495337987658744, 0.08963507734367862], "isController": false}, {"data": ["Generate Identicon", 20, 0, 0.0, 306.29999999999995, 176, 2614, 183.5, 193.0, 2492.9499999999985, 2614.0, 0.13867221355520887, 0.3301658107990986, 0.07407587970185474], "isController": false}, {"data": ["Get Recipes - Field Selection", 20, 0, 0.0, 186.10000000000002, 176, 192, 187.5, 191.0, 191.95, 192.0, 0.14219087703332955, 0.49029469503611645, 0.0791492186611307], "isController": false}, {"data": ["Get Product Category List", 20, 0, 0.0, 193.5, 174, 355, 186.5, 191.0, 346.7999999999999, 355.0, 0.14167316001983427, 0.19207504692923427, 0.07664739321385564], "isController": false}, {"data": ["Get Todos By User Id", 20, 0, 0.0, 185.29999999999998, 173, 197, 186.0, 195.70000000000002, 196.95, 197.0, 0.14111537593136148, 0.1687458767851095, 0.07496754346353578], "isController": false}, {"data": ["Get All Products", 20, 0, 0.0, 9.049999999999999, 7, 19, 8.0, 13.700000000000006, 18.749999999999996, 19.0, 0.13979171035157614, 6.168309219263298, 0.07371828475571399], "isController": false}, {"data": ["Update Product (PATCH)", 20, 0, 0.0, 185.45, 175, 191, 186.5, 190.0, 190.95, 191.0, 0.14218784436118556, 0.22183525405413093, 0.08164692625427453], "isController": false}, {"data": ["Get Comments - Paginated", 20, 0, 0.0, 185.50000000000003, 174, 195, 187.0, 191.9, 194.85, 195.0, 0.14120404690798438, 0.33655929422687253, 0.07666938484456964], "isController": false}, {"data": ["Get Products - Simulate Delay (perf testing)", 20, 0, 0.0, 2610.899999999999, 2179, 4756, 2194.5, 4179.500000000001, 4728.549999999999, 4756.0, 0.13740888073596197, 6.059677965111885, 0.07393778641163579], "isController": false}, {"data": ["Get Users - Paginated", 20, 0, 0.0, 189.20000000000002, 174, 226, 188.0, 194.0, 224.39999999999998, 226.0, 0.1421918879527923, 2.099357692581138, 0.076789173865131], "isController": false}, {"data": ["Generate Sized Image", 20, 0, 0.0, 622.25, 189, 2684, 201.0, 2338.3000000000006, 2667.75, 2684.0, 0.1386203120343224, 0.9853819466103868, 0.07377741216670479], "isController": false}, {"data": ["Delete Post", 20, 0, 0.0, 184.95, 173, 193, 186.5, 191.9, 192.95, 193.0, 0.14122398830665378, 0.2145390978611627, 0.077369782656282], "isController": false}, {"data": ["Get Users - Field Selection", 20, 0, 0.0, 246.69999999999993, 175, 764, 190.0, 702.0000000000011, 763.65, 764.0, 0.13992374156084933, 0.3960156168013433, 0.0774773061181656], "isController": false}, {"data": ["Delete Comment", 20, 0, 0.0, 184.54999999999998, 172, 193, 184.5, 192.8, 193.0, 193.0, 0.1411572067811922, 0.17018817137896475, 0.07774674279745351], "isController": false}, {"data": ["Search Recipes", 20, 0, 0.0, 187.5, 174, 200, 187.5, 197.3, 199.9, 200.0, 0.14218177940496926, 0.15083209664806455, 0.07692256424839157], "isController": false}, {"data": ["Update Post (PATCH)", 20, 0, 0.0, 184.9, 172, 193, 186.5, 191.9, 192.95, 193.0, 0.14123096912691016, 0.20500557862328053, 0.08040786621190295], "isController": false}, {"data": ["Get Todos - Paginated", 20, 0, 0.0, 190.4, 172, 292, 186.5, 193.70000000000002, 287.0999999999999, 292.0, 0.14114027225958517, 0.26481030085813284, 0.07622126031206114], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 1, 100.0, 0.046296296296296294], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2160, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login (alias: /user/login)", 20, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
