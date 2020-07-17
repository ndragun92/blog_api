'use strict'

const User = use('App/Models/User/User')


class AuthController {

  async register({request, response}) {
    const allParams = request.only([
      'username',
      'email',
      'nickname',
      'password'
    ])

    const checkIfEmailExist = await User.query()
      .where('email', allParams.email)
      .first()

    if (checkIfEmailExist) {
      return response.badRequest({
        _message: 'Email is already in use!',
        _message_code: 'auth.register.emailExists'
      })
    }

    const checkIfUsernameExist = await User.query()
      .where('username', allParams.username)
      .first()

    if (checkIfUsernameExist) {
      return response.badRequest({
        _message: 'Username is already in use!',
        _message_code: 'auth.register.usernameExists'
      })
    }

    const checkIfNicknameExist = await User.query()
      .where('nickname', allParams.nickname)
      .first()

    if (checkIfNicknameExist) {
      return response.badRequest({
        _message: 'Nickname is already in use!',
        _message_code: 'auth.register.nicknameExists'
      })
    }

    const user = await User.create({
      username: allParams.username,
      email: allParams.email,
      nickname: allParams.nickname,
      password: allParams.password
    })

    return response.ok({
      _data: user,
      _message: 'Successfully registered!',
      _message_code: 'auth.register.success'
    })
  }

  async loginAdmin({request, response, auth}) {
    const allParams = request.only(['email', 'password'])

    const findUserEmail = await User.query()
      .where('email', allParams.email)
      .orWhere('username', allParams.email)
      .first()

    let foundUser

    if(findUserEmail) {
      foundUser = findUserEmail.toJSON()
    }

    if (!foundUser) {
      return response.badRequest({
        _message: 'Wrong email or username!',
        _message_code: 'auth.login.incorrect'
      })
    }

    if(!foundUser.super_admin) {
      return response.forbidden({
        _message: 'You are not authorized to login to this website!',
        _message_code: 'auth.login.unauthorized'
      })
    }

    const userEmail = foundUser.email;

    await auth.attempt(userEmail, allParams.password)

    const user = await User.findBy('email', userEmail)

    const token = await auth.withRefreshToken().generate(user)

    response.ok({
      data: user,
      token: token.token,
      refreshToken: token.refreshToken,
      _message: 'Successfully logged in!',
      _message_code: 'auth.login.success'
    })

  }

  async login({request, response, auth}) {

    const allParams = request.only(['email', 'password'])

    const findUserEmail = await User.query()
      .where('email', allParams.email)
      .orWhere('username', allParams.email)
      .first()

    let foundUser

    if(findUserEmail) {
      foundUser = findUserEmail.toJSON()
    }

    if (!foundUser) {
      return response.badRequest({
        _message: 'Wrong email or username!',
        _message_code: 'auth.login.incorrect'
      })
    }

    const userEmail = foundUser.email;

    await auth.attempt(userEmail, allParams.password)

    const user = await User.findBy('email', userEmail)

    const token = await auth.withRefreshToken().generate(user)

    response.ok({
      data: user,
      token: token.token,
      refreshToken: token.refreshToken,
      _message: 'Successfully logged in!',
      _message_code: 'auth.login.success'
    })

  }

}

module.exports = AuthController
