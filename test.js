
var Formatter = require('./')

var all = new Formatter
all.failed = [{time:1, title: 'title', error: new Error('boom')}]
all.skipped = [{time:1}]
all.pending = [{time:1}]
all.tests = [{time:1}]
	.concat(all.pending)
	.concat(all.skipped)
	.concat(all.failed)
all.displayResult()
all.displayFailed()

var passing = new Formatter
passing.tests = [{time:1}, {time:1}, {time:1}, {time:1}]
passing.displayResult()
passing.displayFailed()
