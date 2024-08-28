// ==UserScript==
// @name         Leap reports downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  automated downloads for brightspace leap activities
// @author       You
// @match        https://leaplti-es.desire2learn.com/Teacher/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coursera.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Wait for the page to fully load
    window.addEventListener('load', createControls);

})();

function downloadReports()
{
    let currentUrl = window.location.href;
    var reportType = getReportType(currentUrl);
    var results = {};
    var tableName = "";
    if (reportType =="StudentOutcomesSummaryReport")
    {
        tableName = "OutcomeSummaryTable";
    }
    else if (reportType =="ContentSummaryReport")
    {
        tableName = "ContentSummaryTable";
    }
    else if (reportType =="ActivitySummaryReport")
    {
        tableName = "ActivitySummaryTable";
    }
    var tableRows = document.querySelectorAll("#"+tableName+" > tbody > tr > td.rating.row-header");
    for (var ori = 0 ; ori< tableRows.length ; ori++)
    {
        //for each outcome row
        var ore = tableRows[ori];
        var orlink = ore.childNodes[1].childNodes[1].href;
        var orname= ore.childNodes[1].childNodes[1].innerHTML;
        var detling = generateDetailsDownloadLink(reportType, orlink);
        results[orname]=detling;
    }
    console.log(results);
    downloadAllReports(reportType, results);
    //var csv=generateCSVreport(results);
    //download("report.csv", csv);
}
function getReportType(currentURL)
{
    //https://leaplti-es.desire2learn.com/Teacher/StudentOutcomesSummaryReport/1765389/25869
    //https://leaplti-es.desire2learn.com/Teacher/ContentSummaryReport/1765389/25869
    //https://leaplti-es.desire2learn.com/Teacher/ActivitySummaryReport/1765389/25869
    if (currentURL.indexOf("/StudentOutcomesSummaryReport/")>0)
    {
        return "StudentOutcomesSummaryReport";
    }
    if (currentURL.indexOf("/ContentSummaryReport/")>0)
    {
        return "ContentSummaryReport";
    }
    if (currentURL.indexOf("/ActivitySummaryReport/")>0)
    {
        return "ActivitySummaryReport";
    }
}
function generateDetailsDownloadLink(reportType, orlink)
{
    //first: extract data
    var detailedReportPath = "";
    var reportTypePath = "";
    if (reportType =="StudentOutcomesSummaryReport")
    {
        //https://leaplti-es.desire2learn.com/Teacher/StudentOutcomesSummaryAsCSV/1765389?sort=LastName&sortdir=asc&lo_taxonomyId=1765392&isDetail=True
        reportTypePath = "StudentOutcomesSummaryAsCSV";
        //https://leaplti-es.desire2learn.com/Teacher/StudentOutcomeDetailReport/1859888/27434?sort=LastName&lo_taxonomyId=1859893
        detailedReportPath = "StudentOutcomeDetailReport";
    }
    else if (reportType =="ContentSummaryReport")
    {
        //https://leaplti-es.desire2learn.com/Teacher/StudentContentSummaryAsCSV/1765389?sort=Name&sortdir=asc&lo_taxonomyId=1765392&isDetailByContent=True
        reportTypePath = "StudentContentSummaryAsCSV";
        //https://leaplti-es.desire2learn.com/Teacher/ContentDetailReport/1859888/27434?lo_taxonomyId=1859893
        detailedReportPath = "ContentDetailReport";
    }
    else if (reportType =="ActivitySummaryReport")
    {
        //https://leaplti-es.desire2learn.com/Teacher/ActivitySummaryReportAsCsv/1765389?lo_taxonomyId=1765392&sort=LastName&sortdir=asc&isDetail=True
        reportTypePath = "ActivitySummaryReportAsCsv";
        //https://leaplti-es.desire2learn.com/Teacher/ActivitySummaryReportByStudent/1859888/27434?sort=LastName&lo_taxonomyId=1859893
        detailedReportPath = "ActivitySummaryReportByStudent";
    }
    var search = "/"+detailedReportPath+"/";
    var pos = orlink.indexOf(search) + search.length;
    var p1 = orlink.slice(pos);
    var lessonid = p1.slice(0,p1.indexOf("/"));
    var p2 = p1.slice(p1.indexOf("/"));
    var taxid = p2.slice(p2.indexOf("lo_taxonomyId=")+"lo_taxonomyId=".length);

    var newlink = "https://leaplti-es.desire2learn.com/Teacher/"+reportTypePath+"/";
    if (reportType =="ContentSummaryReport")
    {
        newlink += lessonid+"?lo_taxonomyId="+taxid+"&isDetail=True";
    }
    else
    {
        newlink += lessonid+"?sort=LastName&sortdir=asc&lo_taxonomyId="+taxid+"&isDetail=True";
    }


    return newlink;
}
function downloadAllReports(reportType, results)
{
    for (let key in results)
    {
        //console.log(`${key}: ${results[key]}`);
        downloadBlob(reportType+" "+key+".csv", results[key]);
    }
}

function downloadBlob(filename, link) {
    fetch(link)
        .then(response => response.blob())
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var element = document.createElement('a');
            element.setAttribute('href', url);
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
            window.URL.revokeObjectURL(url); // Free up memory
        })
        .catch(error => console.error('Error downloading file:', error));
}

function createControls()
{
    var where = document.querySelector("div.tab-content > div:nth-child(2)");

    var buttonfilter= document.createElement("button");
    buttonfilter.innerHTML="Download detailed reports ";
    buttonfilter.setAttribute("style","background-color: #1c61a7;border: none;color: white;padding: 10px 20px;text-align: center;text-decoration: none;display: inline-block;font-size: 12px;border-radius: 8px;");
    buttonfilter.setAttribute("class","paginate_button");
    buttonfilter.addEventListener( 'click', function()
    {
        downloadReports();
    });

    where.appendChild(buttonfilter);
    console.log("Components created");
}