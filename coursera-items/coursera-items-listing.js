// ==UserScript==
// @name         Coursera item listing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.coursera.org/teach/*/content/edit
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

function generateItemList()
{
    var filter = document.getElementById("gen_filter").value;
    var results = [];

    var modules = document.querySelectorAll("div.rc-ModuleRow");
    for (var mi = 0 ; mi< modules.length ; mi++)
    {

        //for each module on page, find the module header
        var module = modules[mi];
        var module_name = module.querySelector("div.module-title").childNodes[0].childNodes[0].childNodes[1].innerHTML;

        var lessons = module.querySelectorAll("div.rc-Lesson");
        for (var li=0; li<lessons.length; li++)
        {
            var lesson = lessons[li];
            var lesson_name = lesson.querySelector("div.rc-LessonNameEditor").childNodes[0].childNodes[0].childNodes[1].innerHTML;

            var items = lesson.querySelectorAll("div.item-title-container");

            for (var ii=0;ii<items.length;ii++)
            {
                var item = items[ii];
                var item_type = item.childNodes[0].innerHTML;
                var item_name = item.querySelector('[data-track-component="item_name"]').childNodes[0].value;

                var item_row = getElementParent(item,7);
                var item_id = item_row.getAttribute("data-rbd-draggable-id");
                var item_url = generateItemUrl(item_type, item_id);

                if(item_name.includes(filter) || item_type.includes(filter))
                {
                    var item_result={};

                    item_result["module_number"]=mi+1;
                    item_result["module"]=module_name;

                    item_result["lesson_number"]=li+1;
                    item_result["lesson"]=lesson_name;

                    item_result["item_number"]=ii+1;
                    item_result["item_type"]=item_type.substring(0,item_type.length - 2);
                    item_result["item_name"]=item_name;
                    item_result["item_id"]=item_id;
                    item_result["item_url"]=item_url;

                    results.push(item_result);
                }
            }
        }
    }
    console.log(results);
    var csv=generateCSVreport(results);
    download("report.csv", csv);
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
function generateItemUrl(item_type, item_id)
{
    var url= window.location.href;
    var end_pos = getPosition(url,"/",6);
    url = url.substring(0,end_pos);

    if (item_type == "Vídeo: ")
    {
        url += "/content/item/lecture/"+item_id;
    }
    else if (item_type == "Actividad de programación: ")
    {
        url += "/content/item/programming/"+item_id;
    }
    else if (item_type == "Complemento no calificado: ")
    {
        url += "/content/item/plugin/"+item_id;
    }
    else if (item_type == "Laboratorio no calificado: ")
    {
        url += "/content/item/ungradedLab/"+item_id;
    }
    else if (item_type == "Lectura: ")
    {
        url += "/content/item/supplement/"+item_id;
    }
    else if (item_type == "Cuestionario: ")
    {
        url += "/content/item/quiz/"+item_id;
    }
    else if (item_type == "Tarea calificada: ")
    {
        url += "/content/item/project/"+item_id;
    }
    else if (item_type == "Cuadro de aviso de la discusión: ")
    {
        url += "/content/item/discussionPrompt/"+item_id;
    }
    else if (item_type == "Cuadro de aviso de debate con calificación: ")
    {
        url += "/content/item/gradedDiscussionPrompt/"+item_id;
    }
    else if (item_type == "Revisión por el compañero: ")
    {
        url += "/content/item/peer/"+item_id;
    }
    else if (item_type == "Artículo de aplicación: ")
    {
        url += "/content/item/lti/"+item_id;
    }
    else if (item_type == "Revisión de compañero: ")
    {
        url += "/content/item/teammate-review/"+item_id;
    }
    return url;
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
    buttonfilter.innerHTML=">> Get item list ";
    buttonfilter.setAttribute("class", "cds-1 cds-button-disableElevation css-1m4vu0e");
    buttonfilter.setAttribute("style","margin-left: 10px;");
    div3.appendChild(buttonfilter);

    buttonfilter.addEventListener( 'click', function()
    {
        generateItemList();
    });

    where.appendChild(div1);
}