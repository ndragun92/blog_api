'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * UserTransformer class
 *
 * @class UserTransformer
 * @constructor
 */
class UserTransformer extends BumblebeeTransformer {

  static get defaultInclude () {
    return [
    ]
  }


  static get availableInclude () {
    return [
    ]
  }
  /**
   * This method is used to transform the data.
   */
  transform (user) {
    return {
     // add your transformation object here
      email: user.email,
      nickname: user.nickname,
      super_admin: !!user.super_admin
    }
  }

}

module.exports = UserTransformer
