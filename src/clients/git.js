const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
const { REPO_STORAGE } = require('../config/config');
const _ = require('lodash');

const sendLog = (output) => {
  if(! _.isEmpty(output)){
    console.log(`Result: ${output.trim()}`);
  }
};

async function clone(repoPath, projectName) {
  try {
    const {stdout, stderr} = await exec(`git clone --progress https://github.com/${projectName}.git ${repoPath}/${projectName}`);
    console.log(`Repository ${projectName} cloned with success`);
    sendLog(stdout);
    sendLog(stderr);

  } catch (error) {
    console.warn(`Clone repository ${projectName} failed`);
    console.warn(`Reasion for failure : ${error.stderr}`);
    throw error;
  }

}
async function pull(rootPath, projectName) {
  try {
    const {stdout, stderr} = await exec(`git pull origin master`,{
      cwd: `${rootPath}/${projectName}`
    });
    sendLog(stdout);
    sendLog(stderr);
  } catch (error) {
    console.warn(`Pull project ${projectName} failed`);
    console.warn(`Reasion for failure : ${error.stderr}`);
    throw error;
  }
}

async function log(rootPath, projectName) {
  try {
    const {stdout} = await exec('git log --date=iso8601-strict --pretty=format:"%H_%an_%ad_%s"',{
      cwd: `${rootPath}/${projectName}`
    });

    console.log(`Commits log obtained with sucess for repository ${projectName}`);
    return stdout;
  
  } catch (error) {
    console.warn(`Get logs from repository ${projectName} failed`);
    console.warn(`Reasion for failure : ${error.stderr}`);
    throw error;
  }
}

async function getCommitsFromScratch(org, repository) {
  const repoFullname = `${org}/${repository}`;
  const repoPath = `${REPO_STORAGE}/${repoFullname}`;
  if (fs.existsSync(repoPath) ) {
    console.log(`Repository ${repoPath} already cloned.`);
    await pull(org, repository);
  }
  else {
    await clone(org, repository);
  }
  const logs = await log(org, repository);
  const commits = logs.split('\n');
  const commitsObjects = commits.map((commit) => {
    const commitProps = commit.split('_');
    return {
      hash: commitProps[0],
      author: commitProps[1],
      timestamp: commitProps[2],
      message: commitProps[3]
    };
  });

  return commitsObjects;
}

async function getCommits(rootPath, projectName) {
  const logs = await log(rootPath, projectName);
  const commits = logs.split('\n');
  const commitsObjects = commits.map((commit) => {
    const commitProps = commit.split('_');
    return {
      hash: commitProps[0],
      author: commitProps[1],
      timestamp: commitProps[2],
      message: commitProps[3]
    };
  });

  return commitsObjects;
}
module.exports = {
  getCommits,
  pull,
  getCommitsFromScratch,
  clone
};

