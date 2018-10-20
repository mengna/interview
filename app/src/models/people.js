const mongoose = require('mongoose');
const keyConversionUtil = require('../utilities/keyConvertionUtil');
const _ = require('lodash');


const Schema = mongoose.Schema;

const peopleSchema = new Schema({
    is_active: {
        type:     Boolean,
        default:  false
    },
    age: {
        type:    Number,
        default: 0
    },
    eye_color: {
        type:    String,
        default: ''
    },
    name: {
        type:    String,
        default: ''
    },
    gender: {
        type:    String,
        default: ''
    },
    tags: {
        type:    [String],
        default: []
    }
}, { versionKey: false });

peopleSchema.pre('validate', function(next) {
    keyConversionUtil.camelCaseToSnakeCase(this);
    next();
});

peopleSchema.post('findOne', function(doc) {
    if(_.get(doc, '_doc')) {
        doc._doc = keyConversionUtil.snakeCaseToCamelCase(doc._doc);
    }
});

peopleSchema.post('find', function(doc) {
    _.forEach(doc, (item) => {
        if (_.get(item, '_doc')) {
            item._doc = keyConversionUtil.snakeCaseToCamelCase(item._doc);
        }
    });
});


module.exports = mongoose.model('people', peopleSchema);
