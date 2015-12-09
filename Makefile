TESTS = test/*.js
REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--require test/common.js \
		--reporter $(REPORTER) \
		--growl \
        --recursive \
		$(TESTS)

.PHONY: test bench
