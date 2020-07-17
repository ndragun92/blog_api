'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Media extends Model {

  user () {
    return this.hasOne('App/Models/User/User', 'user_id', 'id')
  }

}

module.exports = Media
