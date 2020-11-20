const express 			= require('express');
const app 				= express();
const swaggerUi 		= require('swagger-ui-express');
const swaggerDocument 	= require('./swagger.json');
const opcClient			= require('./opc-client');
const bodyParser 		= require('body-parser')

const options = {
	validatorUrl : null,
	oauth: {
	 clientId: "your-client-id1",
	 clientSecret: "your-client-secret-if-required1",
	 realm: "your-realms1",
	 appName: "your-app-name1",
	 scopeSeparator: ",",
	 additionalQueryStringParams: {}
 },
 docExpansion: 'full',
 operationsSorter: function (a, b) {
	 var score = {
		 '/test': 1,
		 '/bar': 2
	 }
	 console.log('a', a.get("path"), b.get("path"))
	 return score[a.get("path")] < score[b.get("path")]
 }
};

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use('/api-docs', swaggerUi.serve)
app.get('/api-docs', swaggerUi.setup(swaggerDocument, false, options, '.swagger-ui .topbar { background-color: crimson }'));

app.get('/opcs/:opcId/tags/:tagId', async function (req, res) {
	let value = await opcClient.read(req.params.opcId, req.params.tagId)
	res.status(200).send({ opcId: req.params.opcId, tagId: req.params.tagId, value : value });
});

app.post('/opcs/:opcId/tags/:tagId', async function (req, res) {
	await opcClient.write(req.params.opcId, req.params.tagId, req.body.dataType, req.body.value);
	res.status(200).send({ opcId: req.params.opcId, tagId: req.params.tagId, dataType: req.body.dataType, value : req.body.value });
});


app.use(function(req, res) {
    res.send(404, 'Page not found');
});


module.exports = app;