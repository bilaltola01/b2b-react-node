"use strict";

const ImageUpload = require('../models/image-upload.model');
const BranchImage = require('../models/branch-image.model');
const Company = require('../models/company.model');
const md5 = require('md5');

class ImageUploadController {

}

ImageUploadController.post = async (req, res) => {
    //console.log(req.body);
    res.setHeader('Content-Type', 'application/json');
    try {
        const {id, catid} = req.body.obj;
        const obj = req.body.obj;
        const result = await Company.getByEmail(req.decoded);
        const name = obj.file.name;
        obj.file = obj.file || {};
        if(obj.file.folder === 'meal'){
            obj.file.folder = `company/${result.CompanyID}/meal/${id}/category/${catid}`;
        }else{
            obj.file.folder = `company/${result.CompanyID}/${obj.file.folder || 'branch'}/${id || 0}`;
        }
        obj.file.name = `${md5(obj.file.name)}`;
        const output = await ImageUpload.create(obj);
        output.name = name;
        res.status(201).json({ success: true, message: 'ImageUpload successfully created', obj: output });
    } catch (err) {
        console.error(err);
        res.status(203).send({ success: false, message: 'ImageUpload get failed', obj: err });
    }
};

ImageUploadController.put = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    ImageUpload.update(req.body.email, req.body.updates).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'ImageUpload successfully updated', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'ImageUpload update failed', obj: err });
    });
};

ImageUploadController.remove = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const result = await BranchImage.getById(req.query.id);
        // console.log(result);
        if (result && result.Path) {
            var paths = result.Path.split('/');
            var id = paths.length > 0 ? paths[paths.length - 1] : null;
            const output = await ImageUpload.remove(id.split('.')[0])
            // console.log(output);
            if (output.result == "not found") {
                res.status(204).send({ success: false, message: 'Image delete failed', obj: err });
            } else {
                await BranchImage.remove(req.query.id);
                res.status(201).json({
                    success: true, message: 'Image successfully deleted',
                    obj: Object.assign(result, output)
                });
            }
        }

    } catch (err) {
        console.error(err);
        res.status(204).send({ success: false, message: 'ImageUpload update failed', obj: err });
    };
};

module.exports = ImageUploadController;