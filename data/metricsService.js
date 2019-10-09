'use strict';
let dataStoreService = require("./dataStoreService");

let logCreation = function(shortLink) {
	dataStoreService.storeEvent("CREATE", shortLink, undefined);
	return;
}

let logVisit = function(shortLink, req) {
	dataStoreService.storeEvent("VISIT", shortLink, req);
	return;
}

let generateMetrics = function(shortLink) {
	return new Promise((resolve, reject) => {
		dataStoreService.fetchEvents(shortLink).then(result => {
			let visitCount = 0;
			let createTime;
			let countPerDay = {}
			for(let i in result) {
				let record = result[i].attrs;
				if (record["EventType"] == "CREATE") {
					createTime = record["CreationTimeUTC"];
				} else if (record["EventType"] === "VISIT") {
					let date = new Date(record["CreationTimeUTC"]).toDateString();
					if (countPerDay[date]) {
						countPerDay[date] = countPerDay[date] + 1;
					} else {
						countPerDay[date] = 1;
					}
					visitCount += 1;
				}
			}

			return resolve({
				visitCount: visitCount,
				createTime: createTime,
				countPerDay: countPerDay,
			});
		}).catch(err => {
			return reject({});
		});
	});
}

module.exports = {
	logCreation: logCreation,
	logVisit: logVisit,
	generateMetrics: generateMetrics,
}