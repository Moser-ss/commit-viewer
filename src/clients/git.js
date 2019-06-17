const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
const REPO_STORAGE = '/tmp/repos'
const _ = require('lodash');

const sendLog = (output) => {
  if(! _.isEmpty(output)){
    console.log(`Result: ${output.trim()}`)
  }
}

async function clone(org, repository) {
  const repoFullname = `${org}/${repository}`
  try {
    const {stdout, stderr} = await exec(`git clone --progress https://github.com/${repoFullname}.git ${REPO_STORAGE}/${repoFullname}`);
    console.log(`Repository ${repoFullname} cloned with success`)
    sendLog(stdout)
    sendLog(stderr)

  } catch (error) {
    console.warn(`Clone repository ${repoFullname} failed`)
    console.warn(`Reasion for failure : ${error.stderr}`)
    throw error
  }

}
async function pull(org, repository) {
  const repoFullname = `${org}/${repository}`
  try {
    const {stdout, stderr} = await exec(`git pull`,{
      cwd: `${REPO_STORAGE}/${repoFullname}`
    });
    sendLog(stdout)
    sendLog(stderr)
  } catch (error) {
    console.warn(`Pull repository ${repoFullname} failed`)
    console.warn(`Reasion for failure : ${error.stderr}`)
    throw error
  }
}

async function log(org, repository) {
  const repoFullname = `${org}/${repository}`
  try {
    const {stdout} = await exec('git log --date=iso8601-strict --pretty=format:"%H_%an_%ad_%s"',{
      cwd: `${REPO_STORAGE}/${repoFullname}`
    });

    console.log(`Commits log obtained with sucess for repository ${repoFullname}`)
    return stdout
  
  } catch (error) {
    console.warn(`Get logs from repository ${repoFullname} failed`)
    console.warn(`Reasion for failure : ${error.stderr}`)
    throw error
  }
}


async function getCommits(org, repository) {
  const repoFullname = `${org}/${repository}`
  const repoPath = `${REPO_STORAGE}/${repoFullname}`
  if (fs.existsSync(repoPath) ) {
    console.log(`Repository ${repoPath} already cloned.`)
    await pull(org, repository);
  }
  else {
    await clone(org, repository)
  }
  const logs = await log(org, repository)
  const commits = logs.split('\n');
  const commitsObjects = commits.map((commit) => {
    const commitProps = commit.split('_')
    return {
      hash: commitProps[0],
      author: commitProps[1],
      timestamp: commitProps[2],
      message: commitProps[3]
    }
  })

  return commitsObjects
}
module.exports = {
  getCommits
}

