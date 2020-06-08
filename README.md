# apigee-nodejs-scripts
Scripts to help with certain use cases by orchestrating the Apigee Management APIs

## Pre-req
- NodeJS 8.x or later

## Steps
- Clone this repo `git clone https://github.com/ssvaidyanathan/apigee-nodejs-scripts.git`
- Run `npm install` to install the dependencies

### To export API Proxies that are deployed in a given environment
- Execute `node exportDeployedProxies.js`
- Provide your Apigee org, env, username, password, directory to export the proxies
