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

export const handleUpload = async (req) => {
  const extName = path.extname(req.file.originalname).toString();
  const file64 = parser.format(extName, req.file.buffer);

  const res = await cloudinary.uploader.upload(file64.content, {
    resource_type: 'auto',
  });
  return res;
};
