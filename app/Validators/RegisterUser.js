'use strict'

class registerUser {

  get validateAll () {
    return true
  }

  // Example: 'exists:currencies,id', 'required_when:type,tutor', 'required|boolean'

  get rules () {
    return {
      nickname: 'required|regex:^[0-9a-zA-Z]+$',
      username: 'required|min:4|regex:^[0-9a-zA-Z]+$',
      email: 'required|min:4|email',
      password: 'required|min:4'
    }
  }

  get messages () {
    return {
      'nickname.required': 'Nadimak je obavezan!',
      'nickname.regex': 'Nadimak mora sadržavati brojeve ili slova!',
      'username.required': 'Korisničko ime je obavezno!',
      'username.min': 'Korisničko ime mora sadržavati barem 4 znaka!',
      'username.regex' : 'Korisničko ime mora sadržavati brojeve ili slova!',
      'email.required': 'Email je obavezan!',
      'email.min': 'Email mora sadržavati barem 4 znaka!',
      'password.required': 'Lozinka je obavezna!',
      'password.min': 'Lozinka mora sadržavati barem 4 znaka!'
    }
  }
}

module.exports = registerUser
