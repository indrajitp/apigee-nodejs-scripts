var prompt = require("prompt");
var colors = require("colors/safe");
const rp = require("request-promise");
const fs = require('fs');

var schema = {
    properties: {
      org: {
        description: colors.yellow("Please provide the Apigee Edge Organization name"),
        message: colors.red("Apigee Edge Organization name cannot be empty!"),
        required: true
      },
      env: {
        description: colors.yellow("Please provide the Apigee Edge Environment name"),
        message: colors.red("Apigee Edge Environment name cannot be empty!"),
        required: true
      },
      username: {
        description: colors.yellow("Please provide the Apigee Edge username"),
        message: colors.red("Apigee Edge username cannot be empty!"),
        required: true
      },
      password: {
        description: colors.yellow("Please provide the Apigee Edge password"),
        message: colors.red("Apigee Edge password cannot be empty!"),
        hidden: true,  
        replace: '*',
        required: true
      },
      dir: {
        description: colors.yellow("Please provide the local directory to download the exported proxies"),
        message: colors.red("Local directory cannot be empty!"),
        required: true
      }
    }
  };

//
// Start the prompt
//
prompt.start();

prompt.get(schema, async function (err, config) {
  await exportDeployedProxiesInAnEnv(config);
});

let mgmtURL = "https://api.enterprise.apigee.com/v1/organizations";
let mgmtOAuthURL = "https://login.apigee.com/oauth/token";

async function getAccessToken(config){
  console.log("Getting OAuth Access token");
  let options = {
      method: "POST",
      uri: mgmtOAuthURL,
      form: {
          grant_type: "password",
          username: config.username,
          password: config.password,
      client_id: "edgecli",
      client_secret: "edgeclisecret"
      },
      json: true
  };
  try{
    let parsedBody = await rp(options);
    let accessToken = parsedBody.access_token;
    return accessToken;
  }
  catch(err){
    console.log(err);
  }
}

async function getEntities(config, entity, token){
  let options = {
      method: "GET",
      uri: mgmtURL+"/"+config.org+"/"+entity,
      headers: {
          "Authorization": "Bearer "+token
      },
      json: true
  };
  try{
    let parsedBody = await rp(options);
    return parsedBody;
  }
  catch(err){
    console.log(err);
  }
}


async function exportObj(config, entity, token, filename){
  let options = {
      method: "GET",
      encoding: null,
      uri: mgmtURL+"/"+config.org+"/"+entity,
      headers: {
          "Content-Type": "application/octet-stream",
          "Authorization": "Bearer "+token
      }
  };
  try{
    let response = await rp(options);
    const buffer = Buffer.from(response, 'utf8');
    fs.writeFileSync(filename, buffer);
    return;
  }
  catch(err){
    console.log(err);
  }
}

async function exportDeployedProxiesInAnEnv(config){
  console.log(`Exporting Proxies to ${config.dir}`);
  let token = await getAccessToken(config);
  let apis = await getEntities(config, `environments/${config.env}/deployments?format=bundle`, token);
  for (api of apis.aPIProxy){
    console.log( `Exporting Proxy: ${api.name} Revision: ${api.revision[0].name} from ${config.env} Environment`);
    await exportObj(config, `apis/${api.name}/revisions/${api.revision[0].name}`, token, `${config.dir}/${api.name}_rev_${api.revision[0].name}.zip`);
  }
}

