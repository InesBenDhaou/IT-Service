import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

function getUploadConfig(folder: string) {
  return {
    storage: diskStorage({
      destination: (req, file, callback) => {
        callback(null, `./files/${folder}`);
      },
      filename: (req, file, callback) => {
        const uniqueSuffix = uuidv4();
        const extension = extname(file.originalname);
        const filename = `${uniqueSuffix}${extension}`;
        callback(null, filename);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf|txt)$/)) {
        callback(new Error('Unsupported file type'), false);
      } else {
        callback(null, true);
      }
    },
  };
}

export { getUploadConfig };
