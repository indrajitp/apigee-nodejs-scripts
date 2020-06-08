# apigee-nodejs-scripts
Scripts to help with certain use cases by orchestrating the Apigee Management APIs

## Disclaimer
These tools are not an official Google product, nor are they part of an official Google product, nor are they included under any Google support contract.
Support is available on a best-effort basis via github or [community.apigee.com](https://community.apigee.com) .


## Pre-req
- NodeJS 8.x or later

## Steps
- Clone this repo `git clone https://github.com/ssvaidyanathan/apigee-nodejs-scripts.git`
- Run `npm install` to install the dependencies

### To export API Proxies that are deployed in a given environment
- Execute `node exportDeployedProxies.js`
- Provide your Apigee org, env, username, password, directory to export the proxies
