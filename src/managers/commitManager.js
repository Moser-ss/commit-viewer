const fs = require('fs');
const _ = require('lodash');
const { Commit } = require('../db/models/commit');
const gitClient = require('../clients/git');
const {REPO_STORAGE} = require('../config/config');

const getCommits = async function (projectName) {
    const repoPath = `${REPO_STORAGE}/${projectName}`;
    try {
        if (fs.existsSync(repoPath) ) {
            await gitClient.pull(REPO_STORAGE, projectName);
            const commits = await gitClient.getCommits(REPO_STORAGE, projectName);
            await saveCommits(commits,projectName);
            return commits;
        } else {
            await gitClient.clone(REPO_STORAGE, projectName);
            //Should return a task
            const commits = await gitClient.getCommits(REPO_STORAGE, projectName);
            return commits;
        }
    } catch (error) {
        console.error(`Fail to get commits from ${projectName}`);
        throw new Error(`Fail to get commits from ${projectName}`);
    }

};

const saveCommits = async function(commits,projectName) {
    const commitsPromises = commits.map(async (commit) => {
            const doc = await Commit.find({'hash':commit.hash});
            if (_.isEmpty(doc)) {
                const commitModel = new Commit({
                    ...commit,
                    project: projectName
                });
                await commitModel.save();
            }
    });
    
    await Promise.all(commitsPromises);
};

const getCommitsFromDB = async function(projectName){
    const docs = await Commit.find({ project: projectName });
    if (_.isEmpty(docs)){
        return getCommits(projectName);
    }
    const docsParsed = docs.map( doc => _.pick(doc,['hash', 'author', 'timestamp', 'message']));
    return docsParsed;
};
module.exports = {
    getCommits,
    getCommitsFromDB
};