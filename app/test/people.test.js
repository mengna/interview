const test = require('ava');
const people = require('../src/routes/people');
const PeopleModel = require('../src/models/people');
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');


test.beforeEach(t => {
    PeopleModel.find = sinon.stub();
});

test('should return 200 status with person info data', async t => {
    const req = httpMocks.createRequest({
        query: {gender: "male"}
    });

    const res = httpMocks.createResponse();

    PeopleModel.find.resolves();

    await people.getPeopleByGender(req, res);

    const data = JSON.parse(res._getData());

    console.log(data);

    t.is(res.statusCode, 200);

});


