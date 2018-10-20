const PeopleModel = require('../models/people');
const TagModel = require('../models/tags');
const ImportedFileModel = require('../models/importedFiles');
const _ = require('lodash');
const request = require('request');


exports.createPerson = async (req, res, next) => {
    const body = req.body;

    const personData = {
        is_active: body.is_active,
        age: body.age,
        eye_color: body.eye_color,
        name: body.name,
        gender: body.gender,
        tags: body.tags
    };

    const newPerson = new PeopleModel(personData);
    newPerson.save().catch((err)=>{
        if(err){
            return next({status: 601, message: err.message});
        }
    });

    return res.status(200).json({status: 'success', message: 'new person created'});
};

exports.import = async(req, res, next) => {
    const filePath = 'http://dataservice/people.json';

    // check idempotency key
    const impFile = await ImportedFileModel.findOne({file_path: filePath }).catch((err) => {
        if(err) {
            return next({status: 601, message: err.message});
        }
    });

    if (!_.isEmpty(impFile)){
        return res.status(202).json({data: {count: 0}, status: 'success', message: 'file already been imported'});
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
        return res.status(500).json({status: 'failed', message: 'file not exist'})
    }


    let tags = {};

    _.forEach(file, (item) => {
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
            return next({status: 601, message: err.message});
        }
    });

    const insertedPeople = await PeopleModel.insertMany(file).catch((err) => {
        if (err){
            return next({status: 601, message: err.message});
        }
    });

    const newKey = new ImportedFileModel({file_path: filePath});
    newKey.save().catch((err)=>{
        if(err){
            return next({status: 601, message: err.message});
        }
    });

    return res.status(200).json({data: {count: insertedPeople.length}, status: 'success', message: 'import data success'});
};

exports.getTags = async(req, res, next) => {

    const tagCount = await TagModel.find({}).select(['-_id', 'tag_name', 'count']).catch((err)=>{
        if(err){
            return next({status: 601, message: err.message});
        }
    });

    tags = {}
    _.forEach(tagCount, (item) => {
        tag = item._doc;
        tags[tag.tagName] = tag.count;
    });

    return res.status(200).json({data: tags, status: 'success', message: 'get tags success'});
};

exports.getPersonById = async(req, res, next) => {
    const userId = req.params.id;

    const person = await PeopleModel.findOne({_id: userId}).catch((err) => {
        if(err){
            return next({status: 601, message: err.message});
        }
    });

    return res.status(200).json({data: person, status: 'success', message: 'get person by id success'});
};

exports.getPeopleByGender = async(req, res, next) => {
    const people = await PeopleModel.find(req.query).catch((err) => {
        if(err) {
            return next({status: 601, message: err.message});
        }
    });

    return res.status(200).json({data: people, status: 'success', message: 'get people by gender success'});
};