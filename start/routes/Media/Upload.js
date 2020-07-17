'use strict'
const Route = use('Route')

module.exports =

  Route.group(() => {
    Route.get('/get', 'Media/UploadController.find')
    Route.post('/upload', 'Media/UploadController.upload')
    Route.get('/internal', 'Media/MediaController.find')
    Route.post('/internal/upload', 'Media/MediaController.upload')
    Route.delete('/internal/:id', 'Media/MediaController.delete')
  }).prefix('api/v1/media').middleware(['auth', 'getUser', 'isAdmin'])
