const {   OPCUAClient,
          MessageSecurityMode, 
          SecurityPolicy,
          AttributeIds,
          makeBrowsePath,
          ClientSubscription,
          TimestampsToReturn,
          MonitoringParametersOptions,
          ReadValueIdLike,
          ClientMonitoredItem,
          DataValue, 
          DataType }    = require("node-opcua");

const sleep             = require('./sleep');
const config            = require('./config');
const _                 = require('lodash');
const opcServers        = config.opcServers;

async function _sendCommand(opcId, callback){

  let relatedOpc = _.find(opcServers, x => x.id === opcId);

  let client = OPCUAClient.create({
    applicationName: relatedOpc.name,
    connectionStrategy: relatedOpc.connectionStrategy,
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
    endpoint_must_exist: false,
  });

  // step 1 : connect to 
  await client.connect(relatedOpc.endpointUrl);
  console.log("connected !");

  // step 2 : createSession
  session = await client.createSession(relatedOpc.userIdentity);
  console.log("session created !");

  let result = await callback(session);

  await client.disconnect();

  return result;
}

function dateTypeParser(dataType){
  switch (dataType) {
    case "Boolean":
      return DataType.Boolean;
    case "Byte":
      return DataType.Byte;
    case "ByteString":
      return DataType.ByteString;
    case "DataValue":
      return DataType.DataValue;
    case "DateTime":
      return DataType.DateTime;
    case "Double":
      return DataType.Double;
    case "Float":
      return DataType.Float;
    case "Int16":
    case "Short":
      return DataType.Int16;
    case "Int32":
      return DataType.Int32;
    case "Int64":
      return DataType.Int64;
    case "String":
      return DataType.String;
    default:
      //todo barisv
      break;
  }
}

async function read(opcId, nodeId){
  return await _sendCommand(opcId, async session => {
    let result = await session.readVariableValue(nodeId);
    return result.value.value;;
  });
}

async function write(opcId, nodeId, dataType, value){
  return await _sendCommand(opcId, async session => {
    var nodesToWrite = [
      {
        nodeId: nodeId,
        attributeId: AttributeIds.Value,
        value: {
          value: {
            dataType: dateTypeParser(dataType),
            value: 1
          }
        }
      }
    ];
  
    await session.write(nodesToWrite);
  });
};
  
module.exports = {
    write         : write,
    read          : read
}