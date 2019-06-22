const fs = require('fs');
const _ = require('lodash');
const { Commit } = require('../db/models/commit');
const { Task } = require('../db/models/task');
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
            const taskID = await generateTask(projectName);
            fetchProject(projectName,taskID)
                .then(async(taskID) => {
                    await Task.findByIdAndUpdate(taskID,{status: 'COMPLETED'});
                });

            return taskID;
        }
    } catch (error) {
        console.error(`Fail to get commits from ${projectName}`);
        throw new Error(`Fail to get commits from ${projectName}`);
    }

};
const generateTask = async function (projectName) {
    const task = new Task({
        project: projectName
    });
    const doc = await task.save();

    return doc._id;
};

const fetchProject = async function (projectName,taskID) {
    await gitClient.clone(REPO_STORAGE, projectName);
    const commits = await gitClient.getCommits(REPO_STORAGE, projectName);
    await saveCommits(commits,projectName);
    return taskID;
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