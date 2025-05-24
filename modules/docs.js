exports.install = function() {
	ROUTE('GET /docs/', generate);
};

function generate($) {

	var self = $;

	// if (!self.query.generate) {
		//self.redirect('https://docs.totaljs.com/?url=' + encodeURIComponent(self.hostname('/docs/?generate=1')));
		// return;
	// }

	var builder = [];
	var arr = [];
	let ix = 0;
	for (var key in F.routes.api) {
		var api = F.routes.api[key];
		for (var m in api) {

			var r = api[m];
			var index = r.path.indexOf('*');
			var url = r.path.substring(0, index).trim();
			var path = r.path.substring(index + 1).split('-->').trim();
			var schema = GETSCHEMA(path[0]);
			var workflow = '';
			var data = url.indexOf('-', 3) === -1;
			var fields = [];
			var obj = {};

			url = url.split(/\s{2,}/).trim();
			ix++;
			if (path[1] && path[1].split(' ').length > 2)
				path[1] = path[1].split(' ')[1];

			if (schema) {
				var action = schema.meta[path[1]];
				if (!action) {
					action = schema.meta['workflow_' + path[1]];
					workflow = path[1];
				}

				if (workflow) {
					var action = schema.meta['workflowaction_' + path[1]];
					if (action) {
						obj.name = action.name;
						obj.params = action.params;
						obj.query = action.query;
						obj.input = action.input;
						obj.output = action.output;
					}
				}

				if (data && !obj.input) {
					for (var key of schema.fields) {
						var type = schema.schema[key];
						var datatype = '';

						switch (type.type) {
							case 0:
								datatype = 'undefined';
								break;
							case 1:
							case 2:
							case 11:
								datatype = 'Number';
								break;
							case 3:
								datatype = 'String' + (type.length ? ('(' + type.length + ')') : '');
								break;
							case 4:
								datatype = 'Boolean';
								break;
							case 5:
								datatype = 'Date';
								break;
							case 6:
								datatype = 'Object';
								break;
							case 8:
								datatype = '[' + type.raw.join(', ') + ']';
								break;
							case 7:
							case 12:
								datatype = type.raw;
								break;
						}

						fields.push({ name: key, type: datatype, array: type.isArray, required: type.required });
					}
				}

				obj.fields = fields;
				obj.data = data;
				obj.url = url;
				obj.schema = schema.name;

				arr.push(obj);
			}
		}
	}

	var groups = {};
	for (var item of arr) {
		if (groups[item.schema])
			groups[item.schema].push(item);
		else
			groups[item.schema] = [item];
	}

	builder.push('# Documentation: __' + CONF.name + '__');
	builder.push('');
	builder.push('URL address: <{0}>'.format(self.hostname()));

	builder.push('');
	builder.push('## API operations ({0} routes)'.format(ix));
	builder.push('');


	for (var key in groups) {

		builder.push('');
		builder.push('### ' + key);

		for (var item of groups[key]) {
			var url = item.url.join('  ');

			builder.push('::: `{0}`'.format(url) + (url[0] === '+' ? ' {authorized}(flag)' : ''));

			var req = ('{"method":"API","auth":' + (item.required ? 'true' : false) + ',"url":"{0}","schema":"{1}","operation":"{2}","operationtype":"{3}"}').format(item.url[1], item.schema, item.url[2], item.data ? 'POST' : 'GET');
			req = Buffer.from(encodeURIComponent(req), 'utf8').toString('base64');

			if (item.name)
				builder.push('__{0}__'.format(item.name));

			if (item.summary)
				builder.push('> '.format(item.summary));

			builder.push('- :fas fa-flask: [create a request](#api_' + req + ')');

			if (url[0] === '+')
				builder.push('- request must be __authorized__');

			if (item.query)
				builder.push('- query `{0}`'.format(item.query));

			if (item.params)
				builder.push('- params `{0}`'.format(item.params));

			if (item.input)
				builder.push('- input data `{0}`'.format(item.input));

			if (item.output)
				builder.push('- output data `{0}`'.format(item.output));

			if (item.fields.length) {
				builder.push('__Payload__:');
				for (var field of item.fields) {
					var val = '`{0} {{1}}`'.format(field.name, field.type);
					builder.push('- ' + (field.required ? ('__' + val + '__ required') : val));
				}
			}

			builder.push(':::');
		}
	}

	var model = builder.join('\n');
	self.view('docs', model);
}

