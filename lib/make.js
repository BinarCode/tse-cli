const {log, error, success, logWithSpinner, stopSpinner} = require('tse-shared-utils')
const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
let ejs = require('ejs')
const toUpper = str => {
    return str.replace(/(^[a-z])/,function (p) { return p.toUpperCase(); } )
}
async function make(modelName, options) {
    logWithSpinner('⚓', `Creating route | controller | model for ${chalk.yellow(modelName)} entity.`)
    await makeModel(modelName, options);
    logWithSpinner(`Creating model`)
    await makeController(modelName, options);
    logWithSpinner(`Creating controller`)
    await makeRoute(modelName, options);
    logWithSpinner(`Creating CRUD routes`)
    stopSpinner()
    log()
    log(`🎉  Successfully created entity ${chalk.yellow(modelName)}.`)
    log(
        `👉  Get started with the following commands:\n\n` +
        (chalk.cyan(` ${chalk.gray('$')} npm run watch`)) +
        `\n`+
        chalk.cyan(` ${chalk.cyan('POSTMAN')} ${chalk.blue('http://127.0.0.1:3000/'+ modelName +'/')}`)
    )
    log()
}

async function makeRoute(modelName, options) {
    const BASE_TEMPLATE = path.resolve(__dirname, '../', 'templates', 'route.ejs');
    const DEST_DIR = 'src/routes';
    const targetDir = `${process.cwd()}/${DEST_DIR}`;
    await fs.ensureDir(targetDir);
    let replacing = {
        model_name: modelName,
        model_name_cap: toUpper(modelName)
    };
    writeFile(BASE_TEMPLATE, targetDir + '/' + modelName + '.ts', replacing)
}

async function makeController(modelName, options) {
    const BASE_TEMPLATE = path.resolve(__dirname, '../', 'templates', 'controller.txt');
    const DEST_DIR = 'src/controllers';
    const targetDir = `${process.cwd()}/${DEST_DIR}`;
    await fs.ensureDir(targetDir);
    let replacing = {
        model_name: modelName,
        model_name_cap: toUpper(modelName)
    }
    writeFile(BASE_TEMPLATE, targetDir + '/' + toUpper(modelName) + 'Controller.ts', replacing)

}

async function makeModel(modelName, options) {
    const BASE_TEMPLATE = path.resolve(__dirname, '../', 'templates', 'model.txt');
    const DEST_DIR = 'src/models';
    const targetDir = `${process.cwd()}/${DEST_DIR}`;
    await fs.ensureDir(targetDir);
    let replacing = {
        model_name: modelName,
        model_name_cap: toUpper(modelName)
    }
    writeFile(BASE_TEMPLATE, targetDir + '/' + toUpper(modelName) + 'Schema.ts', replacing)

}

async function writeFile(baseTemplate, destinationPath, replacing) {
    const stats = fs.statSync(baseTemplate);
    if (stats.isFile()) {
        let contents = fs.readFileSync(baseTemplate, 'utf8');
        contents = ejs.render(contents, replacing)
        const writePath = `${destinationPath}`;
        fs.writeFileSync(writePath, contents, 'utf8');
    }
}

module.exports = (...args) => {
    make(...args).catch(err => {
        error(err.message);
        process.exit(1)
    })
}
