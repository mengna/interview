const mongoose = require('mongoose');
const keyConversionUtil = require('../utilities/keyConvertionUtil');
const _ = require('lodash');

const Schema = mongoose.Schema;

const importedFilesSchema = new Schema({
    file_path: {
        type:     String,
        required: true
    }
}, { versionKey: false });


importedFilesSchema.post('findOne', function(doc) {
    if(_.get(doc, '_doc')) {
        doc._doc = keyConversionUtil.snakeCaseToCamelCase(doc._doc);
    }
});

module.exports = mongoose.model('imported_files', importedFilesSchema);
