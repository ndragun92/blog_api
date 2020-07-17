'use strict'
const Route = use('Route')

module.exports =

  Route.group(() => {
    Route.get('/profile', 'User/UserController.profile')
  }).prefix('api/v1/user').middleware(['auth', 'getUser'])
