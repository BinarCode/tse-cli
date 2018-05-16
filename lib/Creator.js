const chalk = require('chalk')
const repo = require('./repo')
const {logWithSpinner} = require('../util/spinner')
/**
 * Temporary
 * @type {string}
 */
const url = 'https://github.com/tsejs/tse.git';
module.exports = class Creator {
    constructor(name, context) {
        this.name = name
        this.context = context
    }

    async init () {
        try {
            const done = await repo.cloneRepo(url, this.context)
            if(done) {
                logWithSpinner(`✨`, `Successfully created project  ${chalk.yellow(this.name)}.`)
            }
        } catch(err) {
            if (err) {
                switch (err.code) {
                    case 422:
                        console.log(chalk.red('There already exists a remote repository with the same name'));
                        break;
                    default:
                        console.log(err);
                }
            }
        }
        console.log(`🎉  Successfully created project ${chalk.yellow(this.name)}.`)
    }
};
