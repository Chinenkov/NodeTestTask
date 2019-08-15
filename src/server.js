'use strict';

const Hapi = require('hapi');
const AuthCoockie = require('hapi-auth-cookie');
const Vision = require('vision');
const Handlebars = require('Handlebars');
const routes = require('./routes/index');
const db = require('./database/index');

module.exports = function () {
    const server = Hapi.server({
        port: 3000,
        host: '127.0.0.1'
    });

    server
        .register([
            AuthCoockie,
            Vision
        ])
        .then(() => {
            server.views({
                engines: {
                    html: Handlebars
                },
                path: 'templates',
                relativeTo: __dirname,
                context: request => {
                    return {
                        user: request.auth.credentials
                    }
                }
            });
            server.auth.strategy('user', 'cookie', {
                cookie: {
                    name: 'user',
                    password: '1234567890123456789012345678901234567890',
                    isSecure: false
                },
                validateFunc: (request, session) => {
                    return db.users.findOne({ login: session.login })
                    .then(data => {
                        return { valid: true, credentials: data.login };
                    });
                }
            });
            server.route(routes);
            return server.start();
        })
        .then(() => {
            console.log('Server running');
        })
        .catch(err => {
            console.log('Error', err);
        })
}