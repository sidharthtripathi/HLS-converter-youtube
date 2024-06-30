const amqp = require("amqplib")
const {downloadFile,uploadFiles,uploadThumbnail} = require('./appwrite');
const createHLS = require("./createHLS");
const {createThumbnail} = require("./thumbnail");
const queue = "fileupload";
const { exec } = require('child_process');
const fs = require('fs')
const util = require('util');
const execPromisified = util.promisify(exec);
require('dotenv').config();

(async () => {

  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    process.once("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertQueue(queue, { durable: false });
    await channel.consume(
      queue,
      async (message) => {
        try {
            const msg = JSON.parse(message.content.toString())
            console.log(msg)
            console.log("downloading..")
            await downloadFile(msg.bucketId,msg.fileId)
            console.log('downloaded..')

            console.log("creating thumbnail")
            await createThumbnail(msg.fileId)
            console.log("created thumbnail")

            console.log("uploading thumbnail")
            await uploadThumbnail(msg.fileId)
            console.log("uploaded thumbnail")

            console.log("HLS conversion started")
            await createHLS(msg.fileId)
            console.log("HLS conversion ended")

            console.log("uploading..")
            await uploadFiles(`outputHLS/${msg.fileId}`,'6678141f0015a5ed911b')
            console.log("uploaded")
            await cleanup(msg.fileId)

            channel.ack(message)
    
        } catch (error) {
            console.log(error)
            channel.reject(message,false)
        }
      },
      { noAck: false }
    );

  } catch (err) {
    console.warn(err);
    
  }
})();

async function cleanup(videoId){
  const {stdout,stderr} = await execPromisified(`
      rm inputVideos/${videoId} inputVideos/thumbnails/${videoId}* &&
      rm -rf outputHLS/${videoId}*
    
    `)
  if(stderr) console.log(stderr)
}

