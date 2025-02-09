// Search through a jQuery element's children (assuming the element is the
// root of the page to view an FA artwork) and figure out the download URL
// and the button you would press to favorite it.
function getDownloadUrlAndFavElement (root) {
	var downloadElement = root.find("a:contains('Download')[href]");
	var downloadUrl = makeCannonicalUrl(downloadElement.attr('href'));
	var favElement = root.find("a:contains('+Add to Favorites')[href]");
	return [downloadUrl, favElement];
}

/**
 * Takes a protocol-relative URL (e.g. '//host.com/some/path.jpg') and converts
 * it to a cannonical URL (e.g. 'https://host.com/some/path.jpg').
 * @param {string} url
 */
function makeCannonicalUrl (url) {
	if (url.startsWith("//")) {
		return location.protocol + url;
	}
	return url;
}