const _ = require('lodash');
const commitManager = require('../../managers/commitManager');

const getCommits = function (req, res) {
    const { org, repo } = req.params;
    if(_.isUndefined(org) && _.isUndefined(repo)){
        res.status(400).send({
            ok: false,
            message: 'Missing parameters'
        });
    }
    const commits = commitManager.getCommits(`${org}/${repo}`);
    res.status(200).send({
        ok:true,
        message: `Commits for project ${org}/${repo} retrieved with success`,
        commits
    });
};

module.exports = {
    getCommits
};