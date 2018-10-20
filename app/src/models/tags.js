const mongoose = require('mongoose');
const keyConversionUtil = require('../utilities/keyConvertionUtil');
const _ = require('lodash');

const Schema = mongoose.Schema;

const tagsSchema = new Schema({
    tag_name: {
        type:     String,
        required: true
    },
    count: {
        type:     Number,
        default:  0,
        required: true
    }
}, { versionKey: false });

tagsSchema.pre('validate', function(next) {
    keyConversionUtil.camelCaseToSnakeCase(this);
    next();
});

tagsSchema.post('find', function(doc) {
    _.forEach(doc, (item) => {
        if (_.get(item, '_doc')) {
            item._doc = keyConversionUtil.snakeCaseToCamelCase(item._doc);
        }
    });
});

module.exports = mongoose.model('tags', tagsSchema);
