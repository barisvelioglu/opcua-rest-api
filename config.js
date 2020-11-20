module.exports = {
    opcServers : [
        {
            id           : "kepware",
            name         : "Thingworx Kepware",
            endpointUrl  : "opc.tcp://10.214.6.29:49320",
            userIdentity : {
                userName : "Administrator",
                password : "password"
            },
            connectionStrategy : {
                initialDelay: 1000,
                maxRetry: 1
            }
        }
    ]
};