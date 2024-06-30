const { exec } = require('child_process');
const util = require('util');
const execPromisified = util.promisify(exec);
async function createThumbnail(videoId){
    try {
        const command = `ffmpeg -i inputVideos/${videoId} -ss 00:00:05 -vframes 1 -q:v 2 inputVideos/thumbnails/${videoId}.jpg`
        const {stderr,stdout} = await execPromisified(command)
    } catch (error) {
        throw error
    }

}

module.exports = {createThumbnail}