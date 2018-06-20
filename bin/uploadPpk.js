console.log('start')

const fs = require('fs')
const node_ssh = require('node-ssh')
const ssh = new node_ssh()
const path = require('path')
const rootPath = path.resolve(__dirname,'../')
const crypto = require('crypto')
// const config = require(rootPath,'config')
const childProcess = require('child_process')
//
// const ppkFoldPath = path.resolve(rootPath,'pkg/ppk')
// const cmd = `
// pushy bundle --platform ios --output "${ppkFoldPath}"
// `
// console.log(cmd)
//
// // childProcess.execSync(cmd)

console.log('bundled finished')
