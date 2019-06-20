const { Project } = require('../db/models/project');

const addProjectWithUL = async function (url) {
    const regex = /[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\./g;
    const projectName = url.match(regex)[0];
    const project = await addProject(projectName);
    return project;
};

const addProjectWithOrgRepo = async function (org, repo) {
    const project = await addProject(`${org}/${repo}`);
    return project;
};  
const addProject = async function (projectName) {
    const [org, repo ] = projectName.split('/');
    let project = new Project({
        url: `https://github.com/${projectName}.git`,
        org,
        repository: repo,
        name: projectName
    });
    try {
        const doc = await project.save();
        return doc.name;
    } catch (error) {
        throw new Error(`Failed to save project ${projectName} in DB. Error: ${error}`);
    }

};

module.exports = {
    addProjectWithUL,
    addProjectWithOrgRepo
};

