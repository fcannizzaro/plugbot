module.exports = function(name) {

	var id,
		telegram,
		commands = {};

	this.name = function() {
		return name;
	}

	this.getApi = function() {
		return telegram;
	}

	this.getChatId = function() {
		return id;
	}

	this.sendText = function(content) {
		telegram.sendMessage({
			chat_id: id,
			text: content
		});
	}

	this.sendPicture = function(path, caption) {
		telegram.sendPhoto({
			chat_id: id,
			photo: path,
			caption: (caption || "")
		});
	}

	this.main = function(bundle) {

		id = bundle.id;
		telegram = bundle.api;

		if (commands[bundle.action] != null)
			commands[bundle.action](bundle.content);

	};

	this.addAction = function(command, fn) {
		if (typeof fn === 'function')
			commands[command] = fn;
	};

	this.addActions = function(multiple) {
		for (key in multiple)
			if (typeof multiple[key] === 'function')
				commands[key] = multiple[key];
	};

}
