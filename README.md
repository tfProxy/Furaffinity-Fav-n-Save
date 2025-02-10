# Furaffinity-Fav-n-Save
Tampermonkey scripts to add a submission browser to Furaffinity.net, as well as buttons to automatically download &amp; favorite a submission in one click

# Installation

1. Install TamperMonkey extension in your browser (it's available for most browsers)
2. Go to the Tampermonkey extension dawshboard
3. Go to the `Utilities` tab in the Tampermonkey dashboard
4. Scroll to the `Import from URL` and install the following scripts:
	* `https://raw.githubusercontent.com/tfProxy/Furaffinity-Fav-n-Save/refs/heads/main/src/favnsave_view.js`
		* This adds functionality to the individual submission view page (when looking at a specific image)
	* `https://raw.githubusercontent.com/tfProxy/Furaffinity-Fav-n-Save/refs/heads/main/src/favnsave_submissions.js`
 		* * This adds the submission browser to the main 'Submissions' page

# Usage

On an individual image page, if that image isn't already in your favorites, now there will be an option below the image to 'Fav. & Save' the image which will add it to your favorites and download the image in a single click.

On your `Submissions` page, now there will be an option in the toolbar at the top of the submissions list to perform an `Interactive Check`. This will start going through all the images in your submissions list, displaying each one fullscreen and giving you the option to:
* `Fav. & Save` - Favorites the image, downloads it, checks the image on your submissions list, and then advances to the next image.
* `Continue` - Advances to the next image without performing any other actions.
* `Check & Continue` - Checks the image in your submissions list and then advances to the next image.
* `Exit` - Closes the overlay and returns you to your submissions list without taking any other actions.

An example of using this to browse through your pending submissions:
![Running an Interactive Check](https://raw.githubusercontent.com/tfProxy/Fav-n-Save/refs/heads/main/docs/images/Favnsave_submission_browser.gif)

# Settings

You can change some settings for the scripts from the Tampermonkey window when the script is active on a page.

Available settings at the time of writing are:
* `Reverse Browse Order` - Instead of browsing images on this page from newest -> oldest, will browse from oldest -> newest. Useful if you are viewing sequences of images that were uploaded in order.
* `Hide Button Labels`  - Removes the labels from the buttons when the full-screen overlay is present.
