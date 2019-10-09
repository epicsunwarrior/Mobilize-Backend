'use strict';
const axios = require('axios');
const assert = require('assert');

let createEndpoint = "http://localhost:8081/create";
let getLinkEndpoint = "http://localhost:8081/goog";
let getMetricsEndpoint = "http://localhost:8081/get-metrics";

axios.post(createEndpoint, {
    params: {
      link: "https://www.google.com",
    }
}).then(function (response) {
  assert(response.status === 200);
  assert(response.data.link === "https://www.google.com");
  assert(response.data.shortLink === "Z1USYUD");
}).catch(function (error) {
  console.log(error);
});

axios.post(createEndpoint, {
  params: {
    link: "https://www.amazon.com",
    requestedShortLink: "AMZN"
  }
}).then(function (response) {
  assert(response.status === 200);
  assert(response.data.link === "https://www.amazon.com");
  assert(response.data.shortLink === "AMZN");
}).then(axios.post(createEndpoint, {
    params: {
      link: "https://www.walmart.com",
      requestedShortLink: "AMZN"
    }
})).then(function (response) {
  console.log(response);
}).catch(function (err) {
  console.log(err.response.data);
});

axios.post(getMetricsEndpoint, {
    params: {
      shortLink: "goog",
    }
  }).then(function (response) {
    assert(response.data);
    assert(response.data.visitCount > 0);
    assert(response.data.createTime);
    assert(response.data.countPerDay);
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });