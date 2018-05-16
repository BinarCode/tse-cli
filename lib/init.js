const fs = require('fs-extra')
const chalk = require('chalk')
const path = require('path');
const inquirer = require('inquirer');
const validateProjectName = require('validate-npm-package-name')
const Initiator = require('./Initiator')
async function init (projectName, options) {
    if (options.proxy) {
        process.env.HTTP_PROXY = options.proxy
    }

    const inCurrent = projectName === '.'

    const name = inCurrent ? path.relative('../', process.cwd()) : projectName
    const targetDir = path.resolve(projectName || '.')

    const result = validateProjectName(name)
    if (!result.validForNewPackages) {
        console.error(chalk.red(`Invalid project name: "${projectName}"`))

        result.errors && result.errors.forEach(err => {
            console.error(chalk.red(err))
        })
        process.exit(1)
    }

    if (fs.existsSync(targetDir)) {
        if (options.force) {
            await fs.remove(targetDir)
        } else {
            if (inCurrent) {
                const { ok } = await inquirer.prompt([
                    {
                        name: 'ok',
                        type: 'confirm',
                        message: `Generate project in current directory?`
                    }
                ])
                if (!ok) {
                    return
                }
            } else {
                const { action } = await inquirer.prompt([
                    {
                        name: 'action',
                        type: 'list',
                        message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
                        choices: [
                            { name: 'Overwrite', value: 'overwrite' },
                            { name: 'Merge', value: 'merge' },
                            { name: 'Cancel', value: false }
                        ]
                    }
                ])
                if (!action) {
                    return
                } else if (action === 'overwrite') {
                    await fs.remove(targetDir)
                }
            }
        }
    }

    const creator = new Initiator(name, targetDir)
    await creator.init(options)
}

module.exports = (...args) => {
    init(...args).catch(err => {
        chalk.red(err.message);
        process.exit(1)
    })
}
