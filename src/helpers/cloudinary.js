import { v2 as cloudinary } from 'cloudinary';
import DatauriParser from 'datauri/parser.js';
import path from 'path';

import { envs } from './envs.js';

const {
  CLOUDINARY: { CLOUD_NAME, API_KEY, API_SECRET },
} = envs;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const parser = new DatauriParser();

const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

export const handleUpload = async (req, privateDoc = false) => {
  const extName = path.extname(req.file.originalname).toString();
  const file64 = parser.format(extName, req.file.buffer);

  const sanitizedFileName = req.file.originalname
    .toLowerCase()
    .replace(/[\s/\\:*?"<>|ñáéíóú]/g, '_')
    .replace(/ñ/g, 'n')
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u');

  const res = await cloudinary.uploader.upload(file64.content, {
    resource_type: imageFormats.includes(extName) ? 'image' : 'raw',
    public_id: sanitizedFileName,
    type: privateDoc ? 'private' : 'upload',
  });
  return res;
};

export const getDownloadLink = (originalUrl) => {
  const publicId = originalUrl.split('/').pop();
  const extension = originalUrl.split('.').pop();

  return cloudinary.utils.private_download_url(publicId, extension, {
    resource_type: 'raw',
    type: 'private',
  });
};

export const deleteFile = async (originalUrl, privateDoc = false) => {
  const publicId = originalUrl.split('/').pop();

  await cloudinary.uploader.destroy(publicId, {
    type: privateDoc ? 'private' : 'upload',
  });
};

export const deleteAllFiles = async () => {
  await cloudinary.api.delete_all_resources();
}
