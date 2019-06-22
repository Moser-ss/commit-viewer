const _ = require('lodash');
const commitManager = require('../../managers/commitManager');

const getCommits = async function (req, res) {
    const { org, repo } = req.params;
    if(_.isUndefined(org) && _.isUndefined(repo)){
        res.status(400).send({
            ok: false,
            message: 'Missing parameters'
        });
    }
    try {
        let commits = [];
        const { forcerefresh } = req.query;
        if (_.isUndefined(forcerefresh) || forcerefresh != 'true') {
            commits  = await commitManager.getCommitsFromDB(`${org}/${repo}`);
        } else {
            commits = await commitManager.getCommits(`${org}/${repo}`);
        }
        res.status(200).send({
            ok:true,
            message: `Commits for project ${org}/${repo} retrieved with success`,
            commits
        });
    } catch (error) {
        res.status(500).send({
            ok:false,
            message: error.message
        });
    }

};

module.exports = {
    getCommits
};