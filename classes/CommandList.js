const Message = require('./Message.js');
const reqDir = require('require-dir');

module.exports = class CommandList {
	constructor() {
		this.commands = reqDir('../routes/messages/commands/');
	}

	execute(event) {
		const message = new Message(event);
		message.response = this._getResponseObject(event);

		if (message.response) {
			message.respond();
		}
	}

	_getResponseObject(event) {
		if (this._isValidCommand(event)) {
			// User submitted valid command or postback
			return this.commands[event.command](event);
		} else if (this._processMessage(event)) {
			// User submitted data, like an email address
			const command = this._processMessage(event);
			event.command = command;
			return this.commands[command](event);
		} else {
			// User sent message or postback the bot doesn't recognize
			const defaultCommand = 'get_started';
			return this.commands[defaultCommand](event);
		}
	}

	_isValidCommand(event) {
		return this.commands[event.command];
	}

	_processMessage(event) {
		if (this._containsValidEmail(event)) {
			// User sent a message that is a valid email
			return 'save_email';
		}
		return null;
	}

	_containsValidEmail(event) {
		// Test for email format.  Tests in order:
		// one @, dot after @
		// first character is a number or letter
		// last character is a letter

		const email = event.original_message;
		return (
			email &&
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
			/[a-z0-9]/.test(email[0]) &&
			/[a-z]/.test(email[email.length - 1])
		);
	}
};
