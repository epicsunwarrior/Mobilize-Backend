'use strict';

let linkMappingService = require('../data/linkMappingService');
let metricsService = require('../data/metricsService');

let exec = function (shortLink, req) {
	metricsService.logVisit(shortLink, req);
	return linkMappingService.fetchLinkMapping(shortLink);
}

module.exports = {
	exec: exec,
}