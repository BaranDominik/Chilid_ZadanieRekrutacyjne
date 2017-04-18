window.onload = init;


var htmlString;
var tableHeader;

function init(){
   tableHeader = document.getElementById("sluzba").innerHTML;
   filter();
}

function match(data,value,filter_by){
var searchMatch;
htmlString = tableHeader + '<tbody>';
for(i in data){
    searchMatch = true;
    if(filter_by != "id" && filter_by != "experience"){
        for(j = 0; j <= value.length-1; j++)
            if(value.charAt(j).toLowerCase() != data[i][filter_by].charAt(j).toLowerCase()) searchMatch = false;
    } else {
        for(j = 0; j <= value.length-1; j++)
            if(value != data[i][filter_by]) searchMatch = false;      
    }  
    
    if(searchMatch) renderHTML(data[i]);
    }
    htmlString += '</tbody>'; 
};

function filter(){   

var value = document.getElementById("search").value;
var filter_by = document.getElementById("filter_by").value;
    
var ourRequest = new XMLHttpRequest();
ourRequest.open('GET','/www/sluzba.json');
    ourRequest.onload = function(){
        var data = JSON.parse(ourRequest.responseText);
        match(data,value,filter_by);
        document.getElementById("sluzba").innerHTML = htmlString; 
        pagination();
    };
ourRequest.send();
};

function renderHTML(data){
    htmlString += "<tr><td>" + data.id + "</td>" +  "<td>" + data.firstName + "</td>" + "<td>" + data.lastName + "</td>" + "<td>" + data.dateOfBirth + "</td>" + "<td>" + data.function + "</td>" + "<td>" + data.experience + "</td></tr>"  
};

function sortTable(n){
    var table = document.getElementById("sluzba");
    var rows, shouldSwitch;
    var switching = true;
    var currentRow, nextRow;
    var direction = "asc";
    var switchesDone = 0;
    
    while(switching){
        switching = false;
        rows = table.getElementsByTagName("TR");
        
//        rows[0].getElementsByTagName("TH")[0].getElementsByTagName('SPAN')[0].className = 'arrow-down';
        
        for(var i = 1; i < (rows.length-1); i++){
            shouldSwitch = false;
            currentRow = rows[i].getElementsByTagName("TD")[n];
            nextRow = rows[i+1].getElementsByTagName("TD")[n];
            
            if(direction == "asc"){
                if(isNaN(currentRow.innerHTML)){
                    if(currentRow.innerHTML.toLowerCase() > nextRow.innerHTML.toLowerCase()){
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if(parseInt(currentRow.innerHTML) > parseInt(nextRow.innerHTML)){
                        shouldSwitch = true;
                        break;
                    }
                }
            } else if(direction == "desc"){
                 if(isNaN(currentRow.innerHTML)){
                    if(currentRow.innerHTML.toLowerCase() < nextRow.innerHTML.toLowerCase()){
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if(parseInt(currentRow.innerHTML) < parseInt(nextRow.innerHTML)){
                        shouldSwitch = true;
                        break;
                    }
                }
            }
        }
        
        if(shouldSwitch){
            rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
            switching = true;
            switchesDone++;
            
        } else {
            if(switchesDone == 0 && direction == "asc"){
                direction = "desc";
                switching = true;
                }
            }
        }  
};

function pagination(){
    var req_num_row=5;
    var $tr=jQuery('tbody tr');
    var total_num_row=$tr.length;
    var num_pages=0;
    if(total_num_row % req_num_row ==0){
        num_pages=total_num_row / req_num_row;
    }
    if(total_num_row % req_num_row >=1){
        num_pages=total_num_row / req_num_row;
        num_pages++;
        num_pages=Math.floor(num_pages++);
    }
    var linkString = "";
    for(var i=1; i<=num_pages; i++){
        linkString += "<a href='#' class='btn'>"+i+"</a>";
    }
    jQuery("#pagination").html(linkString);
    
    $tr.each(function(i){
        jQuery(this).hide();
        if(i+1 <= req_num_row){
            $tr.eq(i).show();
        }

    });
    jQuery('#pagination a').click(function(e){
        e.preventDefault();
        $tr.hide();
        var page=jQuery(this).text();
        var temp=page-1;
        var start=temp*req_num_row;

        for(var i=0; i< req_num_row; i++){

            $tr.eq(start+i).show();
        }
    });
}