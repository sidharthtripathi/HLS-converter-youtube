const amqp = require("amqplib")
const {downloadFile,uploadFiles} = require('./appwrite');
const createHLS = require("./createHLS");
const queue = "fileupload";

(async () => {

  try {
    const connection = await amqp.connect("amqps://cmdgpuku:SZejYdHxJZq-XlkL03616zX_nRtuB1AH@puffin.rmq2.cloudamqp.com/cmdgpuku");
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

            console.log("HLS conversion started")
            await createHLS(msg.fileId)
            console.log("HLS conversion ended")

            console.log("uploading..")
            await uploadFiles(`outputHLS/${msg.fileId}`,'6678141f0015a5ed911b')
            console.log("uploaded")
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