return JSON.stringify({
	models: models.map(model => model.names.upperCamel)
}, null, 2);
