'use strict';

let linkMappingService = require('../data/linkMappingService');
let metricsService = require('../data/metricsService');
let linkHashingService = require('../data/linkHashingService');

let exec = function (fullUrl, shortLink) {
	let conditionedLink = linkHashingService.conditionUrl(fullUrl);

	let shortLinkOutcome;
	if (shortLink !== "") {
		shortLinkOutcome = linkHashingService.hasConflictingShortLink(shortLink, conditionedLink);
		if (shortLinkOutcome.hasConflict) {
			throw "Shortlink already in use";
		} else {
			shortLinkOutcome["shortLink"] = shortLink;
		}
	} else {
		shortLinkOutcome = linkHashingService.generateShortLink(fullUrl);
	}

	if (shortLinkOutcome.requiresWrite) {
		linkMappingService.storeLinkMapping(shortLinkOutcome["shortLink"], conditionedLink);
	}
	let result = {
		'link': conditionedLink,
		'shortLink': shortLinkOutcome["shortLink"],
	}

	metricsService.logCreation(shortLinkOutcome["shortLink"]);

	return result;
}

module.exports = {
	exec: exec, 
}