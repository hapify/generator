return JSON.stringify({
    models: unknown.map(model => model.names.upperCamel)
}, null, 2);
