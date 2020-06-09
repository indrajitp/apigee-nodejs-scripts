const rp = require("request-promise");
const fs = require('fs');

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

exports.getAccessToken = getAccessToken;
exports.getEntities = getEntities;
exports.exportObj = exportObj;
