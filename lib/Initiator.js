const chalk = require('chalk')
const repo = require('./repo')
const { logWithSpinner, stopSpinner } = require('../util/spinner')
const { log, error, success } = require('../util/logger')
const { promisify } = require('util')
const execa = require('execa')
const download = promisify(require('download-git-repo'))
const spawn = require('child_process').spawn

/**
 * Temporary
 * @type {string}
 */
module.exports = class Creator {
    constructor(name, context) {
        this.template = `tsejs/tse`
        this.name = name
        this.context = context
    }

    async init() {
        try {
            await this.downloadAndGenerate(this.template, this.context)
            log();
            success(`Successfully created project  ${chalk.yellow(this.name)}.`)
        } catch (err) {
            if (err) {
                error(err.message.trim())
            }
        }
    }


    async downloadAndGenerate(template, path) {
        logWithSpinner(`⚙  Downloading template repository. This might take a while...`)
        try {
            await download(template, path, { clone: false });
            stopSpinner()
            await this.generate(path);
        } catch (err) {
            stopSpinner()
            if (err) error('Failed to download repo ' + template + ': ' + err.message.trim())
        }
    }

    async generate(context) {
        return new Promise((resolve, reject) => {
            const spwan = spawn(
                'yarn install',
                [],
                Object.assign(
                    {
                        cwd: context,
                        stdio: 'inherit',
                        shell: true,
                    },
                    {}
                )
            )

            spwan.on('exit', () => {
                resolve()
            })
        })
    }
};
