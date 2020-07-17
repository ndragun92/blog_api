'use strict'

// ****************************************** NOTE ******************************************
// If you are changing this file, be sure to check app/Exceptions/Handler.js too...
// ****************************************** **** ******************************************

const formatResponse = use('App/Helpers/FormatResponse')

class FormatResponseMiddleware {

  async handle({request, response}, next) {
    const headers = request.headers()
    headers.accept = 'application/json'
    const language = headers['accept-language'] || 'en'

    // await everything downstream, if error happens, run formatter nevertheless (catch)
    await next()


    // after everything is finished, handle response logic upstream
    const lazyBody = response._lazyBody
    if (response.implicitEnd && lazyBody.method !== 'redirect') {

      // handle error 429 for too many attempts
      if (response.response.statusCode === 429) {
        lazyBody.content = 'error.tooManyRequests'
      }

      response[lazyBody.method](await formatResponse(lazyBody.content, language))
    }
  }
}

module.exports = FormatResponseMiddleware
