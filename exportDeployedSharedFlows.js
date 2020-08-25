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
        description: colors.yellow("Please provide the local directory to download the exported shared flows"),
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
  await exportDeployedSharedflowsInAnEnv(config);
});



async function exportDeployedSharedflowsInAnEnv(config){
  console.log(`Exporting SharedFlows to ${config.dir}`);
  let token = await utils.getAccessToken(config);
  let sharedFlows = await utils.getEntities(config, `sharedflows`, token);
  for (sharedFlow of sharedFlows){
    let sharedFlowDeployment = await utils.getEntities(config, `sharedflows/${sharedFlow}/deployments`, token);
    if(sharedFlowDeployment && sharedFlowDeployment.environment){
      for (env of sharedFlowDeployment.environment){
        if(env.name && env.name === config.env && env.revision && env.revision.length>0){
          console.log( `Exporting Shared flow: ${sharedFlow} Revision: ${env.revision[0].name} from ${config.env} Environment`);
          await utils.exportObj(config, `sharedflows/${sharedFlow}/revisions/${env.revision[0].name}?format=bundle`, token, `${config.dir}/${sharedFlow}_rev_${env.revision[0].name}.zip`);
        }
      }
    }
    
  }
}

