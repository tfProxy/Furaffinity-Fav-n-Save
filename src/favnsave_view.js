// ==UserScript==
// @name         Fav'n'save - View Page
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Adds a 'Fav. & Save' button to a submission's page to favorite and download the file in a single click
// @author       tfProxy
// @source       https://github.com/tfProxy/Fav-n-Save
// @match        *://*.furaffinity.net/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=furaffinity.net
// @grant        GM_download
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://raw.githubusercontent.com/tfProxy/Fav-n-Save/refs/heads/main/src/shared.js
// ==/UserScript==
var $ = window.jQuery;

// Figure out the download URL and favorite element on the page are
var downloadUrlAndFavElement = getDownloadUrlAndFavElement($(":root"));
var downloadUrl = downloadUrlAndFavElement[0];
var fileName = downloadUrl.split('/').pop()
var favElement = downloadUrlAndFavElement[1];

// Insert the button to do a Fav'n'Save
// We insert before the existing favorites button so that if there is a '<< Newer' button we are on the correct side.
var favNSaveElement = $("<a/>").text("+Fav. & Save").attr("id", "favnsave_viewPageButton");
favNSaveElement.insertBefore(favElement.parent());
$("<span />").text(" | ").insertBefore(favElement.parent());

// Execute the action when the user clicks the button
favNSaveElement.click(function(){
    GM_download({
        url: makeCannonicalUrl(downloadUrl),
        name: fileName,
    });

    var favUrl = favElement.attr('href');
    $.get(favUrl, function() { location.reload() });
});
