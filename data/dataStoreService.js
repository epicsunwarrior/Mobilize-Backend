'use strict';
var dynamo = require('dynamodb');
const JOI = require('@hapi/joi');

dynamo.AWS.config.update({
	accessKeyId: 'anykey', 
	secretAccessKey: 'anykey', 
    region: 'local',
    endpoint: 'http://localhost:8000'
});

var LinkMappings = dynamo.define('LinkMappings', {
  hashKey : 'shortLink',
  timestamps : true,
  createdAt: 'CreationTimeUTC',
  updatedAt: false,
  schema : {
    shortLink	: JOI.string(),
    fullURL 	: JOI.string(),
    tags   		: dynamo.types.stringSet(),
  }
});

var LinkEvents = dynamo.define('LinkEvents', {
  hashKey : 'ShortLink',
  rangeKey : 'CreationTimeUTC',
  timestamps : true,
  createdAt: 'CreationTimeUTC',
  updatedAt: false,
  schema : {
    ShortLink : JOI.string(),
    EventType : JOI.string(),
  	tags : dynamo.types.stringSet(),
  }
});

let storeLinkMapping = function(shortLink, fullUrl) {
	LinkMappings.create({
		"shortLink" : shortLink,
		"fullURL" : fullUrl,
	}, function (err, results) {
  		if (err) {
  			throw err;
  		}
	});
}

let fetchLinkMapping = function(shortLink) {
	return new Promise((resolve, reject) => {
		LinkMappings.get(shortLink, function (err, result) {
			if (err) {
				return reject(err);
			} else {
				if (result && result.get("fullURL")) {
					return resolve(result.get("fullURL"));
				} else {
					return resolve(undefined);
				}
			}
		});
	});
}

let storeEvent = function(eventType, shortLink) {
	LinkEvents.create({
		"ShortLink" : shortLink,
		"EventType" : eventType
	})
}

let fetchEvents = function(shortLink) {
	return new Promise((resolve, reject) => {
		LinkEvents.query(shortLink).loadAll().exec(function(err, result) {
			if (err) {
				return reject(err);
			} else {
				return resolve(result.Items);
			}
		});
	});
}

module.exports = {
	storeLinkMappingRemote: storeLinkMapping,
	fetchLinkMappingRemote: fetchLinkMapping,
	storeEvent: storeEvent,
	fetchEvents: fetchEvents,
}
