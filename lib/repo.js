import files from './files';
console.log(files);

const git         = require('simple-git')();
const CLI         = require('clui')
const Spinner     = CLI.Spinner;
console.log(files);
module.exports = {
    cloneRepo: async (url) => {
        const status = new Spinner('Cloning from remote...');
        status.start();
        try {
            await git.clone(url, );
        } catch(err) {
            throw err;
        } finally {
            status.stop();
        }
    }
};
