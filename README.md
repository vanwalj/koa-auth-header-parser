# koa-auth-header-parser
Yet another very basic auth header parser for koa < 2

## Usage

```es6
const koa = require('koa');
const authHeaderParser = require('koa-auth-header-parser');

const app = koa();

app.use(authHeaderParser());

app.use(function *() {
    const authToken = this.state.authToken;
    const authType = this.state.authType;

    this.assert(authType === 'Bearer', 400);

    const user = yield User.find({ token: authToken });
    this.assert(user, 403);

    this.body = `Hello ${ user.name }`
});
```

## API
```es6
authHeaderParser(opts);
```

| Param | Type | Description |
| --- | --- | --- |
| [opts] | <code>Object</code> |  |
| [opts.handlers] | <code>Object</code> | custom handlers |
| [opts.handlers.[name]] | <code>Function</code> | custom handlers |

## Advanced usage

```es6
app.use(authHeaderParser({
    handlers: {
        Bearer: function * (token) {
            this.state.user = yield User.find({ token });
            this.assert(this.state.user, 403);
        },
        default: function * () {
            this.throw(400, 'Unknown auth method');
        }
    }
}));
```