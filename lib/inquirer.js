const inquirer    = require('inquirer');
module.exports = {
    askModelName: () => {
        const questions = [
            {
                name: 'model',
                type: 'input',
                message: 'Enter model name',
                validate: function( value ) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter model name:.';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    }
};
