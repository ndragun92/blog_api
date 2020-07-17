'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * MediaTransformer class
 *
 * @class MediaTransformer
 * @constructor
 */
class MediaTransformer extends BumblebeeTransformer {

  static get defaultInclude () {
    return [
      'user'
    ]
  }

  /**
   * This method is used to transform the data.
   */
  transform (media) {
    const app_url = process.env.APP_URL
    const sizes = media.sizes ? JSON.parse(media.sizes) : []
    const mediaUrl = `/uploads/media/${media.site_id}/${media.user_id}/${media.type}`
    const mediaUrlOriginal = `${mediaUrl}/${media.file_name_original}.${media.file_name_extension}`
    return {
     // add your transformation object here
      id: media.id,
      file_name: media.file_name,
      file_name_original: media.file_name_original,
      file_name_extension: media.file_name_extension,
      title: media.title,
      type: media.type,
      sizes,
      media: {
        app_url,
        url: mediaUrlOriginal,
        sizes: [
          {
            original: mediaUrlOriginal
          },
          ...sizes.map(obj => {
            return {
              [obj]: `${mediaUrl}/${media.file_name_original}_size_${obj}.${media.file_name_extension}`
            }
          })
        ]
      }
    }
  }

  includeUser (user) {
    return this.item(user.getRelated('user'), UserTransformer)
  }

}

module.exports = MediaTransformer

const UserTransformer = use('App/Transformers/User/UserTransformer')
