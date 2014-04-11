TESTS = $(shell find test -type f -name "*.test.js" | sort)
REPORTER = tap
TIMEOUT = 30000
MOCHA_OPTS = --check-leaks

node_modules:
	@npm install

jshint:
	@-./node_modules/.bin/jshint ./

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--harmony-generators \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--require should \
		$(MOCHA_OPTS) \
		$(TESTS)

.PHONY: test jshint
