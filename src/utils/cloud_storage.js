const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const env = require('../config/env')
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
// library for image resizing
const sharp = require("sharp");
const admin = require('firebase-admin')

const serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    // replace `\` and `n` character pairs w/ single `\n` character
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
})



const storage =  admin.storage();
const bucket = storage.bucket();

/**
 * Subir el archivo a Firebase Storage
 * file objeto que sera almacenado en Firebase Storage
 */
module.exports = (file, pathImage) => {

    return new Promise(async (resolve, reject) => {

        file.buffer = await sharp(file.buffer).resize({
            height: 600,
            withoutEnlargement: true,
          })
          .jpeg({ quality: 60 })
          .toBuffer();
        
        if (pathImage) {
            if (pathImage != null || pathImage != undefined) {

                let fileUpload = bucket.file(`${pathImage}`);
                const blobStream = fileUpload.createWriteStream({
                    metadata: {
                        contentType: 'image/png',
                        metadata: {
                            firebaseStorageDownloadTokens: uuid,
                        }
                    },
                    resumable: false

                });
              
                blobStream.on('error', (error) => {
                    console.log('Error al subir archivo a firebase', error);
                    reject('Something is wrong! Unable to upload at the moment.');
                });

                blobStream.on('finish', () => {
                    // The public URL can be used to directly access the file via HTTP.
                    const url = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media&token=${uuid}`);
                    console.log('URL DE CLOUD STORAGE ', url);
                    resolve(url);
                });

                blobStream.end(file.buffer);
            }
        }
    });
}