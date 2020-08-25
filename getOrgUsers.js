const prompt = require("prompt");
const colors = require("colors/safe");


const utils = require('./utils');

let schema = {
    properties: {
      org: {
        description: colors.yellow("Please provide the Apigee Edge Organization name"),
        message: colors.red("Apigee Edge Organization name cannot be empty!"),
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
      }
    }
  };

//
// Start the prompt
//
prompt.start();

prompt.get(schema, async function (err, config) {
  await getOrgUsers(config);
});

async function getOrgUsers(config){
  let token = await utils.getAccessToken(config);
  let roles = await utils.getEntities(config, `userroles`, token);
  let orgUsers = [];
  for (var i = 0; i < roles.length; i++) {
    if(roles[i] != "devadmin"){
      let users = await utils.getEntities(config, `userroles/${roles[i]}/users`, token);
      if(users && users.length>0)
        Array.prototype.push.apply(orgUsers, users);
    }
  }
  console.log("Org users: " +orgUsers);
}

