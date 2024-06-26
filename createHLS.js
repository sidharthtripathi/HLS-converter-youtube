const { exec } = require('child_process');
const fs = require('fs')
const path = require('path');
const util = require('util');
const execPromisified = util.promisify(exec);
async function createHLS(videoId){
    try {
        
        if(!fs.existsSync(`outputHLS/${videoId}`)){
            fs.mkdirSync(`outputHLS/${videoId}`)
        }
        const command = `ffmpeg -i inputVideos/${videoId} -codec: copy -start_number 0 -hls_time 20 -hls_list_size 0 -f hls outputHLS/${videoId}/${videoId}.m3u8`;
        const {stderr,stdout} = await execPromisified(command)
    } catch (error) {
        throw error
    }     

}


module.exports = createHLS









