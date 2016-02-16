var telegram = require('telegram-bot-api'),
	fs = require("fs"),
	path = require('path');

function PlugBot(options) {

	var self = this;

	this.root = path.dirname(require.main.filename);
	this.id = options.id || null;
	this.token = options.token;
	this.plugin_path = options.plugin_path || this.root + "/plugins/";
	this.logging = options.logging || true;
	this.plugins = {};

	this.init = function() {

		fs.stat(this.plugin_path, function(err, stat) {

			if (!err) {
				self.autoload();
				self.setup();
			}
			else
				console.error("\n [ERROR] Plugin directory not found\n (pass your path in options : \"plugin_path\" )");

		});

	}

	// setup and start bot
	this.setup = function() {

		var self = this;

		api = new telegram({
			token: this.token,
			updates: {
				enabled: true
			}
		});

		if (this.logging)
			console.log("\n > Bot Started\n");

		api.on('message', function(message) {

			// check if account id is the same of config
			if (!self.id || message.from.id == self.id) {
				if (message.text)
					self.execute(message);
			}
			else {

				if (self.logging)
					console.error(
						" [ERROR] Access not authorized from " +
						message.from.first_name + " " +
						message.from.last_name
					);

				return;
			}

		});
	}

	// autoload all plugins in plugins's directory
	this.autoload = function() {

		var files = fs.readdirSync(this.plugin_path);

		for (var i = 0; i < files.length; i++) {
			var file = files[i].split(".")[0];
			this.plugins[file] = require(this.plugin_path + files[i]);
		}

	}

	// @message parse message and send data to plugin
	this.execute = function(message) {

		try {

			var action = message.text.match(/ \w+/);

			var bundle = {
				api: api,
				id: message.chat.id,
				start_command: message.text.match(/\/[a-z]*/)[0].substr(1),
				action: action ? action[0].trim() : "start"
			};

			bundle.content = message.text.split(bundle.action)[1].trim();

			for (plugin in this.plugins) {

				if (this.plugins[plugin].name() === bundle.start_command) {

					this.plugins[plugin].main(bundle);

					if (this.logging) {
						var now = new Date();
						console.log(" Request at " + now.getHours() + ":" + now.getMinutes() + ", Plugin: " + plugin + ", Command: " + bundle.action);
					}
				}
			}

		}
		catch (exception) {

			if (this.logging)
				console.error(" [ERROR] cannot parse message");

		}

	}

}

module.exports = {
	PlugBot: PlugBot,
	Plugin: require("./base.js")
};
