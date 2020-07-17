'use strict'
const Route = use('Route')

module.exports =

  Route.group(() => {
    Route.post('/register', 'Auth/AuthController.register').validator('RegisterUser')
    Route.post('/login', 'Auth/AuthController.login').validator('LoginUser')
  }).prefix('api/v1/auth')

Route.group(() => {
  Route.post('/loginAdmin', 'Auth/AuthController.loginAdmin').validator('LoginUser')
}).prefix('api/v1/auth')
