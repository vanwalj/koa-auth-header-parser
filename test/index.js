'use strict';

const expect = require('chai').expect;
const http = require('http');
const request = require('request');

const koa = require('koa');
const authHeaderParser = require('../');

describe('Koa auth header parser tests', function () {

    it('set correctly header token', function (done) {
        const app = koa();

        app.use(authHeaderParser());

        app.use(function *() {
            expect(this.state.authToken).to.equal('hello_world');
            expect(this.state.authType).to.equal('Bearer');
            done();
        });

        const serv = http.createServer(app.callback());
        const u = serv.listen(function () {
            const address = u.address();
            request({
                url: `http://0:${ address.port }`,
                headers: {
                    'Authorization': 'Bearer hello_world'
                }
            })
        });
    });

    it('use custom function', function (done) {
        const app = koa();

        app.use(authHeaderParser({
            handlers: {
                Bearer: function *(token) {
                    expect(token).to.equal('hello_world');
                    done();
                }
            }
        }));

        const serv = http.createServer(app.callback());
        const u = serv.listen(function () {
            const address = u.address();
            request({
                url: `http://0:${ address.port }`,
                headers: {
                    'Authorization': 'Bearer hello_world'
                }
            })
        });
    });

    it('use custom default function', function (done) {
        const app = koa();

        app.use(authHeaderParser({
            handlers: {
                default: function *def(token) {
                    expect(token).to.equal('hello_world');
                    done();
                }
            }
        }));

        const serv = http.createServer(app.callback());
        const u = serv.listen(function () {
            const address = u.address();
            request({
                url: `http://0:${ address.port }`,
                headers: {
                    'Authorization': 'Bearer hello_world'
                }
            })
        });
    });

    it('send no auth header', function (done) {
        const app = koa();

        app.use(authHeaderParser());

        app.use(function * () {
            expect(this.state.authType).not.to.exist;
            expect(this.state.authToken).not.to.exist;
            done();
        });

        const serv = http.createServer(app.callback());
        const u = serv.listen(function () {
            const address = u.address();
            request({
                url: `http://0:${ address.port }`
            })
        });
    });

});