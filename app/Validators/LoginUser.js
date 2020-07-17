'use strict'

class loginUser {

  get validateAll () {
    return true
  }

  // Example: 'exists:currencies,id', 'required_when:type,tutor', 'required|boolean'

  get rules () {
    return {
      email: 'required|min:4|email',
      password: 'required|min:4'
    }
  }

  get messages () {
    return {
      'email.required': 'Email je obavezan!',
      'email.min': 'Email mora sadržavati barem 4 znaka!',
      'password.required': 'Lozinka je obavezna!',
      'password.min': 'Lozinka mora sadržavati barem 4 znaka!'
    }
  }
}

module.exports = loginUser
