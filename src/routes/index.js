const db = require('../database/index');

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            if(request.state.user) {
                return reply.view('index', {user: request.state.user.login});
            }
            return reply.view('index', {});
        }
    },
    {
        method: 'GET',
        path: '/signup',
        handler: function (request, reply) {
            return reply.view('signup', {});
        }
    },
    {
        method: 'GET',
        path: '/login',
        handler: (request, h) => {
            return h.view('login', {});
        }
    },
    {
        method: 'GET',
        path: '/logout',
        handler: function (req, h) {
            req.cookieAuth.clear();
            return h.redirect('/', {});
        }
    },
    {
        method: 'POST',
        path: '/signup',
        handler: function (req, h) {
            console.log(req.payload);
            const { login, password } = req.payload;
            return db.users
                .findOne({ login })
                .then(data => {
                    console.log(data)
                    if (!data) {
                        return db.users.create({
                            login,
                            password
                        })
                    }
                    return Promise.reject('Пользователь уже существует');
                })
                .then(createdUser => {
                    console.log(createdUser);
                    req.cookieAuth.set({ login });
                    return h.redirect('/')
                })
                .catch(reason => {
                    return h
                        .response(reason)
                        .code(400);
                });
        }
    },
    {
        method: 'POST',
        path: '/login',
        handler: function (req, h) {
            const { login, password } = req.payload;
            return db.users
                .findOne({ login, password })
                .then(data => {
                    if (!data) {
                        return 'Пользователь не существует';
                    }
                    req.cookieAuth.set({ login });
                    return h.redirect('/');
                })
        }
    },
];