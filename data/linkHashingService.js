'use strict';

let hasher = require("shorthash");
let linkMappingService = require('./linkMappingService');

// Function to clean-up urls to reduce duplicates
let conditionUrl = function(fullUrl) {
	let lowerCaseLink = fullUrl.toLowerCase();
	return lowerCaseLink.trim();
}

// Determine the type of conflict present
// If the shortLink and the full link are same as the incoming, perform silent write
let hasConflictingShortLink = function(shortLink, fullUrl) {
	let potentialLink = linkMappingService.fetchLinkMapping(shortLink);
	if (potentialLink === undefined) {
		return {
			requiresWrite: true,
			hasConflict: false
		};
	} else if (fullUrl !== "" && potentialLink === fullUrl) {
		return {
			requiresWrite: false,
			hasConflict: false
		};
	}
	return {
		requiresWrite: false,
		hasConflict: true
	};
}

let generateShortLink = function(fullUrl) {
	let candidateShortLink = hasher.unique(fullUrl);
	let conflictResolution = hasConflictingShortLink(candidateShortLink, fullUrl);
	// There's a small chance for a conflict, but on write and a conflict - we can check and rehash when needed
	while (conflictResolution.hasConflict) {
		candidateShortLink = hasher.unique(fullUrl + candidateShortLink);
		conflictResolution = hasConflictingShortLink(candidateShortLink, fullUrl);
	}
	return {
		requiresWrite: conflictResolution.requiresWrite,
		shortLink: candidateShortLink,
	};
};

module.exports = {
	conditionUrl: conditionUrl,
	hasConflictingShortLink: hasConflictingShortLink,
	generateShortLink: generateShortLink,
}