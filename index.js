'use strict';

const authHeaderReg = /(.*) (.*)/;

function *defaultHandler (token, type) {
    this.state.authToken = token;
    this.state.authType = type;
}

module.exports = function authHeaderParser (options) {
    const _options = Object.assign({
        handlers: {
            default: defaultHandler
        }
    }, options);

    return function *authHeaderParser (next) {
        const authHeader = this.get('authorization');
        if (!authHeader) {
            return yield next;
        }

        const match = authHeader.match(authHeaderReg);
        if (!match || (!_options.handlers[match[1]] && (!_options.handlers || !_options.handlers.default))) {
            return yield next;
        }

        if (_options.handlers[match[1]]) {
            yield _options.handlers[match[1]].call(this, match[2], match[1]);
        } else {
            yield _options.handlers.default.call(this, match[2], match[1]);
        }

        yield next;
    };
};