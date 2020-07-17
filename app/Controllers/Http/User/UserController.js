'use strict'


const User = use('App/Models/User/User')
const UserTransformer = use('App/Transformers/User/UserTransformer')

class UserController {

  async profile({response, user, transform}) {

    const query = await User.query()
      .where('id', user.id)
      .first()

    return response.ok({
      user: await transform.include('site').item(query, UserTransformer),
      _message_code: 'profile.get.success'
    })
  }

}

module.exports = UserController
