'use strict'

const sharp = require('sharp')
const Helpers = use('Helpers');
const helpers = require("../../../../globalFunctions/index")
const MediaTransformer = use('App/Transformers/Media/MediaTransformer')

const Media = use('App/Models/Media/Media')

class MediaController {

  async find({request, response, transform}) {
    let param = request.get()
    let type = param.type || 'cms'
    const {page, limit} = helpers.formatPagination({param})
    const {order, sort} = helpers.formatOrdering({param})

    const pages = await Media.query()
      .where('type', type)
      .orderBy(order, sort)
      .paginate(page, limit)

    return response.ok({
      _data: await transform.paginate(pages, MediaTransformer),
      _message: `Successfully got media!`,
      _message_code: `media.find.success`
    })
  }


  async upload({request, response, user}) {
    const {id} = user


    let allParams = request.only(['title', 'type', 'cropSizes', 'cropType'])

    const {title, type} = allParams
    let {cropSizes, cropType} = allParams

    cropSizes = cropSizes ? JSON.parse(cropSizes) : []
    cropType = cropType || 'contain'

    const images = request.file('image', {
      types: ['image'],
      allowedExtensions: ['jpg', 'png', 'jpeg'],
      size: '10mb'
    });

    if (images.size > 10485760) {
      return response.badRequest({
        _message: 'Max file size is 10 MB!',
        _message_code: 'media.error.maxSize'
      })
    }

    let imagePath = `uploads/media/${user.id}/${type}`;

    let finalNamePath = '';
    let finalNameOriginal = '';
    let finalNameExtension = '';
    await images.moveAll(Helpers.publicPath(imagePath), (file) => {
      let generateName = file.clientName.toLowerCase().replace(' ', '_').split('.')[0];
      let generateNameWithoutExtension = `${new Date().getTime()}-${generateName}`;
      let generateFinalName = `${generateNameWithoutExtension}.${file.subtype}`;

      finalNameOriginal = generateNameWithoutExtension
      finalNameExtension = file.subtype
      finalNamePath = generateFinalName
      return {
        name: generateFinalName
      }
    });

    finalNamePath = `${imagePath}/${finalNamePath}`


    if (!images.movedAll()) {
      return response.badRequest({
        _message: "Image couldn't be uploaded!",
        _message_code: 'media.error.upload'
      })
    } else {
      let decodeImg = JSON.parse(JSON.stringify(images))['_files'][0];
      let fileName = decodeImg.fileName
      let fileType = decodeImg.subtype

      let generateFinalThumbName = `${fileName.split('.').slice(0, -1).join('.')}_size`;

      let sharpPath = imagePath

      let sizes = [
        {size: '90'},
        {size: '180'},
        {size: '360'},
        {size: '720'},
        {size: '900'},
        {size: '1920'}
      ];

      sizes = [...sizes, ...cropSizes.map(obj => {
        return {size: obj}
      })]


      for (let {size} of sizes) {
        let resizeSize = parseInt(size)
        const resizeObject = {
          fit: sharp.fit[cropType],
          width: resizeSize
        }
        if (cropType === 'cover') {
          Object.assign(resizeObject, {
            height: resizeSize
          })
        }
        await sharp(Helpers.publicPath(`${sharpPath}/${fileName}`))
          .resize(resizeObject)
          .toFile(`./public/${sharpPath}/${generateFinalThumbName}_${size}.${fileType}`);
      }

      const image = new Media();
      image.file_name = fileName;
      image.file_name_original = finalNameOriginal;
      image.file_name_extension = finalNameExtension;
      image.title = title;
      image.type = type;
      image.sizes = JSON.stringify(sizes.map(obj => parseInt(obj.size)));
      image.user_id = id;
      image.save();

      return response.ok({
        _data: {
          image,
          media: {
            app_url: process.env.APP_URL,
            url: finalNamePath
          }
        },
        _message: `Successfully uploaded file!`,
        _message_code: `media.upload.success`
      })

    }

  }

  async delete({response, user, params}) {
    const {id} = params

    const findMedia = await Media.query()
      .where('id', id)
      .first()

    let mediaData
    if (findMedia) {
      mediaData = findMedia.toJSON()
    } else {
      return response.badRequest({
        _message: 'Couldn\'t find media!',
        _message_code: 'media.find.error'
      })
    }

    if (mediaData.user_id !== user.id) {
      return response.forbidden({
        _message: 'You don\'t have permissions for this action!',
        _message_code: 'auth.unauthorized'
      })
    }

    const {file_name, file_name_extension, file_name_original} = mediaData
    let {sizes} = mediaData
    sizes = JSON.parse(sizes)

    let files = []

    files.push(helpers.returnMediaFilePath({media: mediaData, fileName: file_name}))

    for (let size of sizes) {
      files.push(helpers.returnMediaFilePath({
        media: mediaData,
        fileName: `${file_name_original}_size_${size}.${file_name_extension}`
      }))
    }

    let deleteFileError = false

    await helpers.deleteMultipleFiles(files, function (err) {
      if (err) {
        deleteFileError = true
      }
    })

    const media = await Media.query()
      .where('id', mediaData.id)
      .delete()
    if (media) {
      return response.ok({
        _data: {
          deleteFileError
        },
        _message: `Successfully deleted file!`,
        _message_code: `media.delete.success`
      })
    } else {
      return response.badRequest({
        _data: {
          deleteFileError
        },
        _message: `Couldn't deleted file!`,
        _message_code: `media.delete.error`
      })
    }

  }

}

module.exports = MediaController
