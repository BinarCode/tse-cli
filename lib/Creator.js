const chalk = require('chalk')
module.exports = class Creator {
    constructor(name, context) {
        this.name = name
        this.context = context
    }

    init() {
        console.log(`🎉  Successfully created project ${chalk.yellow(this.name)}.`)
    }
};
