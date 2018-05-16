const git         = require('simple-git')();
const CLI         = require('clui')
const Spinner     = CLI.Spinner;
module.exports = {
    cloneRepo: async (url, context) => {
        const status = new Spinner('Cloning from remote...');
        status.start();
        console.log(url, 'u');

        try {
            await git.clone(url, context);
        } catch(err) {
            throw err;
        } finally {
            status.stop();
        }
    }
};
