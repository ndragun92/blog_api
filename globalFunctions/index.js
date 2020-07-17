const fs = require('fs')
const Helpers = use('Helpers');

module.exports = {
  formatPagination: function({param, initialPage = 1, initialLimit = 10}) {
    let page = param.page ? param.page : initialPage;
    let limit = param.limit ? param.limit : initialLimit;
    if (limit > 100) limit = 100;
    return {
      page, limit
    }
  },
  formatOrdering: function({param, initialOrder = 'id', initialSort = 'desc'}) {
    let order = param.order ? param.order : initialOrder;
    let sort = param.sort ? param.sort : initialSort;
    return {
      order, sort
    }
  },
  returnMediaFilePath({media, fileName}) {
    const {user_id, type} = media
    return Helpers.publicPath(`/uploads/media/${user_id}/${type}/${fileName}`)
  },
  deleteMultipleFiles(files, callback) {
    for(let file of files) {
      try {
        fs.unlinkSync(file)
        callback(null);
      } catch(err) {
        callback(err);
        return false
      }
    }

  }
};
