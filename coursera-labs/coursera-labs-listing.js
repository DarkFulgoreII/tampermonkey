// ==UserScript==
// @name         Coursera labs listing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.coursera.org/teach/*/content/labs
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coursera.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(createControls, 8000);
    /*window.onload = function(){
        createControls();
    }*/
})();

function generateLabsList()
{
    var filter = document.getElementById("gen_filter").value;
    var results = [];

    var images = document.querySelectorAll("div.rc-WorkspaceImage");
    for (var ii = 0 ; ii< images.length ; ii++)
    {
        var image = images[ii];
        var image_name = image.querySelector("h4.workspace-image-name").innerHTML;
        

        var labs = image.querySelectorAll("div.rc-LabRow");
        for (var li = 0; li < labs.length ; li++)
        {
            var lab = labs[li];

            var lab_cells=lab.querySelectorAll("div.rc-LabsTableCell")
            var lab_name = lab_cells[0].getAttribute("title");
            
            var articles = lab.querySelector('[data-test="usage-link"]');
            if (articles != null)
                articles = articles.childNodes[0].innerHTML;
            else
                articles = "0 artículos";

            var last_updated = lab_cells[2].innerHTML;
            if(lab_name.includes(filter))
            {
                var lab_result={};

                lab_result["image_number"]=ii+1;
                lab_result["image"]=image_name;

                lab_result["lab_number"]=li+1;
                lab_result["lab_name"]=lab_name;
                lab_result["lab_articles"]=articles;
                lab_result["lab_updated"]=last_updated;

                results.push(lab_result);
            }
        }
    }
    console.log(results);
    var csv=generateCSVreport(results);
    download("report_labs.csv", csv);
}
function generateCSVreport(results)
{
    var header="";
    var content = "";
    for (var i = 0 ; i< results.length;i++)
    {
        var item = results[i];
        for (const field_key in item)
        {
            if (i == 0)
            {
                header += field_key+";";
            }
            content+= item[field_key]+";";
        }
        content += "\n";
    }
    return header+"\n"+content;
}
function download(filename, text)
{
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
function getPosition(string, subString, index)
{
  return string.split(subString, index).join(subString).length;
}
function getElementParent(baseElement, level)
{
    var res= baseElement;
    for (var i=0;i<level;i++)
    {
        res = res.parentNode;
    }
    return res;
}
function createControls()
{
    var where = document.querySelector("div.main-menu-row");

    var div1=document.createElement("div");
    div1.setAttribute("class","_96snkam rc-NavCol");
    div1.setAttribute("style","width:auto;padding:10px");

    var div2 =document.createElement("div");
    div2.setAttribute("class","rc-PrelaunchSlideOutContainer");
    div2.setAttribute("style","display: flex;");
    div1.appendChild(div2);

    var div3 =document.createElement("div");
    div3.setAttribute("class","rc-rc-PrelaunchSlideOutButton");
    div3.setAttribute("style","display: flex;");
    div2.appendChild(div3);

    var newtextfield = document.createElement ( "input" );
    newtextfield.setAttribute("type", "text");
    newtextfield.setAttribute("id" , "gen_filter");
    div3.appendChild(newtextfield);

    var buttonfilter= document.createElement("button");
    buttonfilter.innerHTML=">> Get labs list ";
    buttonfilter.setAttribute("class", "cds-1 cds-button-disableElevation css-1m4vu0e");
    buttonfilter.setAttribute("style","margin-left: 10px;");
    div3.appendChild(buttonfilter);

    buttonfilter.addEventListener( 'click', function()
    {
        generateLabsList();
    });

    where.appendChild(div1);
}
