const {Client,Storage} = require('node-appwrite')
const fs = require('fs')
const { InputFile } = require('node-appwrite/file')
const path = require('path')
const client = new Client().setEndpoint("https://cloud.appwrite.io/v1")
.setProject('6677cb9f0008bce34727')
.setKey('1594c90bb47c632aeeb3e3d5a3fb1d9e427e566954147863f5cb5723ac7a2503678931e0d24bf424594608bd95e9c3a224f2772248a005104cc63b9cc0778ff867dd189cef46e3d68ee2287c6127f83944658ba1e6faf52ba923ec03a5451bf57d3999a7aacf277934f76dd430e36dd4f61c41a10715463fb7fa72d20b0152a3')

const storage = new Storage(client)


async function downloadFile(bucketId,fileId){
    try {
        
        const writer = fs.createWriteStream(`inputVideos/${fileId}`)
        let file = await storage.getFileDownload(bucketId,fileId)
        const fileBuffer = Buffer.from(file)
        writer.write(fileBuffer)
        
        
    } catch (error) {
        throw error
    }
   
}
async function uploadFiles(folderPath,bucketId){
    try {
        const files = fs.readdirSync(folderPath)
        console.log('files to upload: ',files)
        files.forEach(async (file)=>{
            console.log("uploading: ",file)
            const res = await storage.createFile(bucketId,file,InputFile.fromPath(path.join(__dirname,folderPath,file),file))
            console.log("done")
            console.log(res)
        })
        
    } catch (error) {
        throw error
    }
}
async function uploadThumbnail(videoId){
    const res = await storage.createFile("6681469e0006135ff29a",videoId+".jpg",InputFile.fromPath(path.join(__dirname,`inputVideos/thumbnails`,videoId+".jpg"),videoId+".jpg"))
    console.log(res)
}

module.exports = {downloadFile,uploadFiles,uploadThumbnail}
