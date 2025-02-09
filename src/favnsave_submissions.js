// ==UserScript==
// @name         Fav'n'save - Submissions Page
// @namespace    http://tampermonkey.net/
// @version      2025-02-09
// @description  Adds an interactive submission browser and Fav. & Save buttons to the submissions page.
// @author       tfProxy
// @source       https://github.com/tfProxy/Fav-n-Save
// @match        *://*.furaffinity.net/msg/submissions/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=furaffinity.net
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://raw.githubusercontent.com/tfProxy/Fav-n-Save/refs/heads/main/src/shared.js
// @resource     FAVNSAVE_CSS https://raw.githubusercontent.com/tfProxy/Fav-n-Save/refs/heads/main/src/favnsave.css
// ==/UserScript==
var $ = window.jQuery;

const favnsave_css = GM_getResourceText("FAVNSAVE_CSS");
GM_addStyle(favnsave_css);

function finishBatchOperation(totalItemsProcessed)
{
	alert("Done processing " + totalItemsProcessed + " submissions.");
	$("#favnsave_submissionsPageButton").show();
}

function startBatchOperation()
{
	var tasksInFlight = 0;
	var totalTasks = 0;
	$("figcaption").each(function(index, figElement) {
		var checkbox = $(figElement).find("input:checked");
		if (checkbox.length > 0)
		{
			tasksInFlight += 1;
			totalTasks += 1;

			// Find the URL for the gallery item we have checked
			var id = checkbox.attr("value");
			var viewUrl = $(figElement).find("a").first().prop("href");

			// Read in the page from the gallery that we would see if we travelled
			// to the checked item, and perform the same actions as if we clicked our
			// custom button that we would have inserted there.
			$.get(viewUrl, function(data, status) {
				var downloadUrlAndFavElement = getDownloadUrlAndFavElement($(data));
				var downloadUrl = downloadUrlAndFavElement[0];
				var favElement = downloadUrlAndFavElement[1];
                var fileName = downloadUrl.split('/').pop()

				// Download the image
				GM_download({
                    url: makeCannonicalUrl(downloadUrl),
                    name: downloadUrl.split('/').pop(),
                });

				// Follow the URL to favorite the item
				var favUrl = favElement.attr('href');
				$.get(favUrl, function(data, status) {
					tasksInFlight -= 1;
					if (tasksInFlight == 0)
					{
						finishBatchOperation(totalTasks);
					}
				});
			});

		}
	});
}

// Variables for going through the submissions in 'interactive' mode.
var submissionElements = [];
var currentSubmissionElement = null;
var interactiveDownloadUrl = "";
var interactiveFavUrl = "";
var disableInteractiveButtons = false;
var interactiveDisplayedCount = 0;
var interactiveSubmissionCount = 0;

// Insert a button we can click to fave&save the checked items.
var button = $("<input />").addClass("button").addClass("remove-checked").attr("id", "favnsave_submissionsPageButton").attr("value", "Fav. & Save checked").attr("type", "button");
$("div.actions").append(button);
$("div.actions").on('click', '#favnsave_submissionsPageButton', function() {
    var count = $("figcaption:has(input:checked)").length;
    if (count > 0) {
        if (confirm("Are you sure you want to Fav. & Save " + count + " submission(s)?")) {
            $("#favnsave_submissionsPageButton").hide();
            startBatchOperation();
        }
    }
});

// Gather the list of submissions
$("figcaption").each(function(index, figCaptionElement) {
    submissionElements.push(figCaptionElement);
});
interactiveSubmissionCount = submissionElements.length;

// Insert the button we can click to do interactive mode.
$("div.actions").append($("<input />").addClass("button").attr("id", "favnsave_interactiveButton").attr("value", "Interactive Check").attr("type", "button"));
$("div.actions").on('click', '#favnsave_interactiveButton', showNextInteractiveImage);

// URL's for the various icons we're using on the buttons.
let heartIconUrl = "https://raw.githubusercontent.com/tfProxy/Fav-n-Save/refs/heads/main/src/icons/heart.svg";
let saveIconUrl = "https://raw.githubusercontent.com/tfProxy/Fav-n-Save/refs/heads/main/src/icons/save.svg";
let xIconUrl = "https://raw.githubusercontent.com/tfProxy/Fav-n-Save/refs/heads/main/src/icons/x.svg";
let arrowRightIconUrl = "https://raw.githubusercontent.com/tfProxy/Fav-n-Save/refs/heads/main/src/icons/arrow-right.svg";
let squareIconUrl = "https://raw.githubusercontent.com/tfProxy/Fav-n-Save/refs/heads/main/src/icons/square.svg";
let checkSquareIconUrl = "https://raw.githubusercontent.com/tfProxy/Fav-n-Save/refs/heads/main/src/icons/check-square.svg";

// Labels for the buttons (if enabled);
let interactiveFavButtonLabel = "Fave & Save";
let interactiveSkipButtonLabel = "Continue";
let interactiveCheckButtonLabel = "Check And Continue";
let interactiveCloseButtonLabel = "Exit";

// Whether or not to show the 'advance' icon on the 'Fav & Save' button.
let interactiveShowAutoCheckButton = checkSquareIconUrl;
let interactiveShowAutoAdvanceButton = arrowRightIconUrl;

// Add the image panel to the body of the page
$("body").prepend(`
				<div id="favnsave_interactivePanelMain" style="display: none;">
					<img id="favnsave_interactiveImage" />
					<div id="favnsave_interactiveStatusMessagePanel">
						<div id="favnsave_interactiveStatusMessage" />
					</div>

					<div id="favnsave_interactivePanelTop">
						<span id="favnsave_interactiveProgressSpan" /> -
						'<strong id="favnsave_interactiveTitleSpan" />'
						by '<strong id="favnsave_interactiveArtistSpan" />'
					</div>

					<div id="favnsave_interactivePanelBottom">
						<div id="favnsave_interactiveButtonPanel">
							<div id="favnsave_interactiveFavButton" class="button">
								<img src="${heartIconUrl}" />
								<img src="${saveIconUrl}" />
								<img src="${interactiveShowAutoCheckButton}" />
								<img src="${interactiveShowAutoAdvanceButton}" />
								<span>${interactiveFavButtonLabel}</span>
							</div>
							<div id="favnsave_interactiveNavButtonPanel">
								<div id="favnsave_interactiveSkipButton" class="button">
									<img src="${squareIconUrl}" />
									<img src="${arrowRightIconUrl}" />
									<span>${interactiveSkipButtonLabel}</span>
								</div>
								<div id="favnsave_interactiveCheckButton" class="button">
									<img src="${checkSquareIconUrl}" />
									<img src="${arrowRightIconUrl}" />
									<span>${interactiveCheckButtonLabel}</span>
								</div>
							</div>
							<div id="favnsave_interactiveCloseButton" class="button">
								<img src="${xIconUrl}" />
								<span>${interactiveCloseButtonLabel}</span>
							</div>
						</div>


					</div>
				</div>
			`);

// Hookup button handlers for interactive buttons
$("#favnsave_interactiveFavButton").on("click", function() {
    if (disableInteractiveButtons) { return; }
    showInteractiveStatusMessage("Performing Fav. & Save...");

    // Download the image
    GM_download({
        url: makeCannonicalUrl(interactiveDownloadUrl),
        name: interactiveDownloadUrl.split('/').pop(),
    });

    // Follow the URL to favorite the item
    $.get(interactiveFavUrl, function(data) {
        $(currentSubmissionElement).find("input[type='checkbox']").prop('checked', true);
        $(currentSubmissionElement).parent().addClass("checked");
        showNextInteractiveImage();
    });
});

$("#favnsave_interactiveCheckButton").on("click", function() {
    if (disableInteractiveButtons) { return; }
    $(currentSubmissionElement).find("input[type='checkbox']").prop('checked', true);
    $(currentSubmissionElement).parent().addClass("checked");
    showNextInteractiveImage();
});

$("#favnsave_interactiveSkipButton").on("click", function() {
    if (disableInteractiveButtons) { return; }
    showNextInteractiveImage();
});

$("#favnsave_interactiveCloseButton").on("click", function() {
    if (disableInteractiveButtons) { return; }
    hideInteractivePanel();
});

// Hook up a listener that will fire when the image is done being loaded
// so we can wait to hide the 'loading' message until it actually is displayed
// instead of only hiding it when we assign the new source
// We're assuming that we were displaying a message here...
$("#favnsave_interactiveImage").on("load", function() {
    hideInteractiveStatusMessage();
}).on("error", function() {
    // Handle this more gracefully? Or display an error or something?
    hideInteractiveStatusMessage();
});

function showInteractiveStatusMessage(message)
{
	$("#favnsave_interactiveStatusMessage").css("display", "").text(message);
	disableInteractiveButtons = true;
}

function hideInteractiveStatusMessage()
{
	$("#favnsave_interactiveStatusMessage").css("display", "none");
	disableInteractiveButtons = false;
}

function showNextInteractiveImage()
{
	showInteractiveStatusMessage("Fetching next image...");
	currentSubmissionElement = submissionElements.shift();
	if (currentSubmissionElement) {
		$("#favnsave_interactivePanelMain").css("display", "");
		var viewUrl = $(currentSubmissionElement).find("a").prop("href");
		var checkboxElement = $(currentSubmissionElement).find("input[type='checkbox']");

		// Download the actual image preview for the element...
		$.get(viewUrl, function(data) {

			var downloadUrlAndFavElement = getDownloadUrlAndFavElement($(data));
			interactiveDownloadUrl = downloadUrlAndFavElement[0];
			interactiveFavUrl = downloadUrlAndFavElement[1].attr('href');

			interactiveDisplayedCount++;
			$("#favnsave_interactiveImage").attr("src", interactiveDownloadUrl);
			$("#favnsave_interactiveTitleSpan").text($(currentSubmissionElement).find("a")[0].title);
			$("#favnsave_interactiveArtistSpan").text($(currentSubmissionElement).find("a")[1].title);
			$("#favnsave_interactiveProgressSpan").text("Submission " + interactiveDisplayedCount + "/" + interactiveSubmissionCount);
		});
	}
	else
	{
		hideInteractivePanel();
	}
}

function hideInteractivePanel()
{
	$("#favnsave_interactivePanelMain").css("display", "none");
}
