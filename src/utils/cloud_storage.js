const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
// library for image resizing
const sharp = require("sharp");
const admin = require('firebase-admin');
const { ConfigService } = require('@nestjs/config');

const project_id = ConfigService.get<String>('firebase.FIREBASE_PROJECT_ID');
const storage = new Storage({
    projectId: project_id,
    keyFilename: {
        "type": ConfigService.get<String>('firebase.FIREBASE_TYPE'),
        "project_id": project_id,
        "private_key_id": ConfigService.get<String>('firebase.FIREBASE_PROJECT_ID'),
        "private_key": ConfigService.get<String>('firebase.FIREBASE_PRIVATE_KEY'),
        "client_email": ConfigService.get<String>('firebase.FIREBASE_CLIENT_EMAIL'),
        "client_id": ConfigService.get<String>('firebase.FIREBASE_CLIENT_ID'),
        "auth_uri": ConfigService.get<String>('firebase.FIREBASE_AUTH_URI'),
        "token_uri": ConfigService.get<String>('firebase.FIREBASE_TOKEN_URI'),
        "auth_provider_x509_cert_url": ConfigService.get<String>('firebase.FIREBASE_AUTH_PROVIDER_X509_CERT_URL'),
        "client_x509_cert_url": ConfigService.get<String>('firebase.FIREBASE_CLIENT_X509_CERT_URL'),
        "universe_domain": ConfigService.get<String>('firebase.FIREBASE_UNIVERSE_DOMAIN'),
      }
});

const bucket = storage.bucket("gs://" + project_id + ".appspot.com/");

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