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



async function exportDeployedProxiesInAnEnv(config){
  console.log(`Exporting Proxies to ${config.dir}`);
  let token = await utils.getAccessToken(config);
  let apis = await utils.getEntities(config, `environments/${config.env}/deployments`, token);
  for (api of apis.aPIProxy){
    console.log( `Exporting Proxy: ${api.name} Revision: ${api.revision[0].name} from ${config.env} Environment`);
    await utils.exportObj(config, `apis/${api.name}/revisions/${api.revision[0].name}?format=bundle`, token, `${config.dir}/${api.name}_rev_${api.revision[0].name}.zip`);
  }
}

