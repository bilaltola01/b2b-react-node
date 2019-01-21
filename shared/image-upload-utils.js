"use strict";

const cloudinary = require('cloudinary');
const constants = require('../constants');

cloudinary.config({
    cloud_name: constants.CLOUDINARY_NAME,
    api_key: constants.CLOUDINARY_API_KEY,
    api_secret: constants.CLOUDINARY_SECRET
});

let ImageUploadUtils = {
    upload: function(data, cb) {
        cloudinary.v2.uploader.upload(data.url, {
            resource_type: "image",
            chunk_size: 50000000,
            folder: data.file.folder,
            public_id: data.file.name,
            // eager: { quality: "jpegmini", crop: "scale", width: 1024, height: 768 }
        }, function(err, res) {
            // console.error(err)
            // console.error(res)
            if (typeof cb === 'function') {
                cb(res);
            }
        });
    },
    /**
     *
     * @description remove image from cloud
     * @param {string} id id from cloud
     * @param {Function} cb
     * @return {void}
     */
    remove: function(id, cb) {
        cloudinary.v2.uploader.destroy(id, { invalidate: true }, function(err, res) {
            // console.log(err)
            // console.log(res)
            if (typeof cb === 'function') {
                cb(res);
            }
        });
    },
};

module.exports = ImageUploadUtils;