'use strict';
const NodeCache = require( "node-cache" );
// To prevent hotspots for highly trafficed shortlinks, use local cache rather than hitting remote database
// Keep values in cache for one hour, and check every 2 minute to purge cache
const localMappingCache = new NodeCache( { stdTTL: 3600, checkperiod: 120 } );

let dataStoreService = require("./dataStoreService");

let storeLinkMapping = function(shortLink, fullUrl) {
	dataStoreService.storeLinkMappingRemote(shortLink, fullUrl);
}

let fetchLinkMapping = function(shortLink) {
	let localValue;
	try {
		localValue = localMappingCache.get(shortLink);
		if (localValue !== undefined) {
			return localValue;
		}
	} catch ( err ){
		console.log(err);
		// If localstore fails, fallover to remote store to get full link
	}

	dataStoreService.fetchLinkMappingRemote(shortLink).then(link => {
		if (link === undefined) {
			return undefined;
		} else {
			localMappingCache.set(shortLink, link);
			return link;
		}
	}).catch(err => {
		console.log(err);
	});
	return undefined;
}

module.exports = {
	storeLinkMapping: storeLinkMapping,
	fetchLinkMapping: fetchLinkMapping,
}