'use strict'

// this one checks token, and returns user so there is no need to call checkToken before
// this middleware queries db for user model

class checkIfAdmin {
    async handle(ctx, next) {

        await ctx.user

        if (!ctx.user.toJSON().super_admin) {
          return ctx.response.forbidden({
            _message: 'You don\'t have permissions for this action!',
            _message_code: 'auth.unauthorized'
          })
        }

        await next()
    }
}

module.exports = checkIfAdmin
