const _ = require('lodash');
const projectManager = require('../../managers/projectManager');

const addProject = async function (req, res)  {
    const {url, org, repo } = req.body; 
    let project = '';
    try {
        if( _.isUndefined(url)){
            if (_.isUndefined(org) && _.isUndefined(repo)) {
                res.status(400).send({
                    ok: false,
                    message: 'Missing project\'s url or org and repo' 
                });
            }
            project = await projectManager.addProjectWithOrgRepo(org, repo);
        } else {
            project = await projectManager.addProjectWithUL(url);
        }
    
        res.status(202).send({
            ok: true,
            message: `Project ${project} added with success`
        });
    } catch (error) {
        res.status(500).send({
            ok:false,
            message: error.message
        });
    }

};

module.exports = {
    addProject
};