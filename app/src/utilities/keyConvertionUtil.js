const _ = require('lodash');


module.exports = {
    snakeCaseToCamelCase: (obj) => {
        const newObj = _.mapKeys(obj, (value, key) => {
            return _.camelCase(key);
        });

        return newObj;
    },
    camelCaseToSnakeCase: (obj) => {
        const newObj = _.mapKeys(obj, (value, key) => {
            return _.snakeCase(key);
        });

        return newObj;
    }
};
