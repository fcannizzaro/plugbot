# PlugBot

[![npm](https://img.shields.io/npm/dm/plugbot.svg)](https://www.npmjs.com/package/plugbot)

Wrapper of [telegram-bot-api](https://github.com/mast/telegram-bot-api/) + plugin support

## Install
```bash
npm install plugbot
```

## Setup bot
```javascript
var bot = require("plugbot").PlugBot;

// set your id if you want to make bot access private
bot = new bot({
	id: <YOUR TELEGRAM ID>,
	token:  <YOUR TOKEN>,
	plugin_path : <SET IF NOT ROOT OF PROJECT>
	logging: true
});

bot.init();
```

## Create a plugin

```javascript
var plugin = new(require("plugbot").Plugin)(<NAME OF PLUGIN>);

// pass object with functions
plugin.addActions({

	action: function(content) {

		  // parse content and execute your function
		  var text = content.toUpperCase();

		  // response
		  plugin.sendText(text);
		  plugin.sendPicture("path", null);
		  plugin.sendPicture("path", "caption");

		  //or access to telegram-bot-api and get chat id
		  plugin.getApi();
		  plugin.getChatId();

	}

});

// or add single action
plugin.addAction("action", function(content) {

  // function

});

module.exports = plugin;
```

## Call from Telegram
```bash
/name-plugin <action> <content>
```

## License

MIT Francesco Cannizzaro
