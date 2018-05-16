#!/usr/bin/env node
const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');

const github       = require('./lib/github');
const repo         = require('./lib/repo');
const files        = require('./lib/files');

clear();
console.log(
    chalk.yellow(
        figlet.textSync('TseJS', { horizontalLayout: 'full' })
    )
);

const createModel = () => {
    return repo.createModel();
}

const run = async () => {
    try {
        await createModel();
        const url = 'https://github.com/tsejs/tse.git';
        const done = await repo.cloneRepo(url, files.getCurrentDirectoryBase() + '/project');
        if(done) {
            console.log(chalk.green('All done!'));
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
}

run();
