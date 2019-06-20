const router = require('express').Router();
const projectController = require('./project');
const commitController = require('./commit');

router.post('/project',projectController.addProject );
router.get('/project/:org/:repo/commits', commitController.getCommits );

module.exports = router;