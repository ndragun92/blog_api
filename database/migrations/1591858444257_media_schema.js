'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MediaSchema extends Schema {
  up () {
    this.create('media', (table) => {
      table.increments()
      table.string('file_name', 254).notNullable()
      table.string('file_name_original', 254).notNullable()
      table.string('file_name_extension', 10).notNullable()
      table.string('title', 50).notNullable()
      table.enu('type', ['blog', 'profile']).defaultsTo('blog').notNullable()
      table.text('sizes', 'longtext')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('media')
  }
}

module.exports = MediaSchema
