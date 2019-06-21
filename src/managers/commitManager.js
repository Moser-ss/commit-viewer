const fs = require('fs');
//const { Commit } = require('../db/models/commit');
const gitClient = require('../clients/git');
const {REPO_STORAGE} = require('../config/config');

const getCommits = async function (projectName) {
    const repoPath = `${REPO_STORAGE}/${projectName}`;
    if (fs.existsSync(repoPath) ) {
        await gitClient.pull(REPO_STORAGE, projectName);
        const commits = await gitClient.getCommits(REPO_STORAGE, projectName);
        return commits;
    } else {
        await gitClient.clone(REPO_STORAGE, projectName);
        const commits = await gitClient.getCommits(REPO_STORAGE, projectName);
        return commits;
    }
};

module.exports = {
    getCommits
};