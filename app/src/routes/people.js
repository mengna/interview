const PeopleModel = require('../models/people');
const TagModel = require('../models/tags');
const ImportedFileModel = require('../models/importedFiles');
const keyConversionUtil = require('../utilities/keyConvertionUtil');
const _ = require('lodash');
const request = require('request');

exports.import = async(req, res, next) => {
    const filePath = 'http://dataservice/people.json';

    // check idempotency key
    const impFile = await ImportedFileModel.findOne({file_path: filePath }).catch((err) => {
        if(err) {
            return next({status: 422, message: err.message});
        }
    });

    if (!_.isEmpty(impFile)){
        return res.status(202).json({count: 0});
    }

    // read file
    let file = null;
    const p = new Promise(function(resolve, reject){
        request.get(filePath, (error, response, body) => {
            if(!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
            }
            else{
                reject('failed to load file');
            }
        })
    });

    try {
        file = await p;
    }
    catch(error){
        return next({status: 500, message: 'failed to load file'})
    }

    // convert camel case to snake case
    let formatedFile = [];
    _.forEach(file, (item) => {
        formatedFile.push(keyConversionUtil.camelCaseToSnakeCase(item));
    });

    let tags = {};

    _.forEach(formatedFile, (item) => {
        _.forEach(item.tags, (tag) => {
            if(!_.has(tags, tag)){
                tags[tag] = 0;
            }
            tags[tag] += 1;
        });
    });

    let tagsList = [];
    _.mapKeys(tags, (count, tagName) => {
        tagsList.push({
            tag_name: tagName,
            count: count
        });
    });

    TagModel.insertMany(tagsList).catch((err) => {
        if (err){
            return next({status: 422, message: err.message});
        }
    });

    const insertedPeople = await PeopleModel.insertMany(formatedFile).catch((err) => {
        if (err){
            return next({status: 422, message: err.message});
        }
    });

    const newKey = new ImportedFileModel({file_path: filePath});
    newKey.save().catch((err)=>{
        if(err){
            return next({status: 422, message: err.message});
        }
    });

    return res.status(200).json({count: insertedPeople.length});
};

exports.getTags = async(req, res, next) => {

    const tagCount = await TagModel.find({}).select(['-_id', 'tag_name', 'count']).catch((err)=>{
        if(err){
            return next({status: 422, message: err.message});
        }
    });

    tags = {}
    _.forEach(tagCount, (item) => {
        tag = item._doc;
        tags[tag.tagName] = tag.count;
    });

    return res.status(200).json(tags);
};

exports.getPersonById = async(req, res, next) => {
    const userId = req.params.id;

    const person = await PeopleModel.findOne({_id: userId}).catch((err) => {
        if(err){
            return next({status: 422, message: err.message});
        }
    });

    return res.status(200).json(person);
};

exports.getPeopleByGender = async(req, res, next) => {
    let gender = '';
    if (!_.isEmpty(req.query)){
        if(req.query.gender){
            gender = req.query.gender.toLowerCase();
            if(gender != 'male' && gender != 'female'){
                return next({status: 422, message: 'invalid gender query'})
            }
        }
        else{
            return next({status: 422, message: 'invalid gender query'})
        }
    }
    const query = gender ? {gender: gender} : {};

    const people = await PeopleModel.find(query).catch((err) => {
        if(err) {
            return next({status: 422, message: err.message});
        }
    });

    return res.status(200).json(people);
};