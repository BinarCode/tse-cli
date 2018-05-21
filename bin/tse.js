#!/usr/bin/env node
const chalk = require('chalk');
const figlet = require('figlet');
const program = require('commander');
const semver = require('semver')
const clear       = require('clear');
const requiredVersion = require('../package.json').engines.node

if (!semver.satisfies(process.version, requiredVersion)) {
    console.log(chalk.red(
        `You are using Node ${process.version}, but this version of tse-cli ` +
        `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
    ))
    process.exit(1)
}

clear();
console.log(
    chalk.yellow(
        figlet.textSync('TseJS', { horizontalLayout: 'full' })
    )
);

program
    .version(require('../package').version)
    .usage('<command> [options]');

program
    .command('init <app-name>')
    .description('generate a project from a remote template')
    .option('-f, --force', 'Overwrite target directory if it exists')
    .action((name, cmd) => {
        require('../lib/init')(name, cleanArgs(cmd))
    })

program
    .command('make <model-name>')
    .description(`generate a model with basic field, controller, and CRUD routes`)
    .option('-c, --controller', 'Generate controller')
    .action((name, cmd) => {
        require('../lib/make')(name, cleanArgs(cmd))
    })

/**
 * Help.
 */

program.on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # create a new project with an official template'))
    console.log('    $ tse init my-project')
    console.log()
    console.log(chalk.gray('    # create a new project straight from a github template'))
    console.log('    $ tse init my-project')
    console.log()
})

// output help information on unknown commands
program
    .arguments('<command>')
    .action((cmd) => {
        program.outputHelp()
        console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
        console.log()
    })

// add some useful info on help
program.on('--help', () => {
    console.log()
    console.log(`  Run ${chalk.cyan(`tse <command> --help`)} for detailed usage of given command.`)
    console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

// enhance common error messages
const enhanceErrorMessages = (methodName, log) => {
    program.Command.prototype[methodName] = function (...args) {
        if (methodName === 'unknownOption' && this._allowUnknownOption) {
            return
        }
        this.outputHelp()
        console.log(`  ` + chalk.red(log(...args)))
        console.log()
        process.exit(1)
    }
}

enhanceErrorMessages('missingArgument', argName => {
    return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
})

enhanceErrorMessages('unknownOption', optionName => {
    return `Unknown option ${chalk.yellow(optionName)}.`
})

enhanceErrorMessages('optionMissingArgument', (option, flag) => {
    return `Missing required argument for option ${chalk.yellow(option.flags)}` + (
        flag ? `, got ${chalk.yellow(flag)}` : ``
    )
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
    program.outputHelp()
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs (cmd) {
    const args = {}
    cmd.options.forEach(o => {
        const key = o.long.replace(/^--/, '')
        // if an option is not present and Command has a method with the same name
        // it should not be copied
        if (typeof cmd[key] !== 'function') {
            args[key] = cmd[key]
        }
    })
    return args
}
