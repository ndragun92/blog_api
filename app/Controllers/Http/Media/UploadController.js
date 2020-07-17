'use strict'

const Cloudinary = use('App/Services/Cloudinary')

class UploadController {

  async find ({ request, response }) {

    return response.json({status: true, data: 'It Works '})
  }

  async upload ({ request, response }) {

    try{

      if(request.file('image')){

        let cloudinary_response = await Cloudinary.upload(request.file('image'))

        return response.ok({
          _data: cloudinary_response,
          _message: 'Successfully uploaded image!', _message_code: 'cms.upload.success'
        })

      }

      return response.badRequest({
        _message: 'Please upload an image!',
        _message_code: 'cms.upload.fail'
      })

    } catch(error){

      const data = {
        status: false,
        error: error.message
      }

      return response.badRequest({
        _data: data,
        _message: 'Error',
        _message_code: 'cms.upload.error'
      })
    }

  }

}

module.exports = UploadController
