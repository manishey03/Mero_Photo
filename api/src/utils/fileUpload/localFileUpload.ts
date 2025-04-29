import path from 'path';
import multer from 'multer';

//
import { FileUploadBase, FileUploadInterface } from './baseFileUpload';

/**
 * Local file upload
 */
export class LocalFileUpload extends FileUploadBase implements FileUploadInterface {
  constructor(limit?: number) {
    const store = multer.diskStorage({
      destination: function (_req, _file, cb) {
        cb(null, 'uploads/');
      },
      filename: function (_req, file, cb) {
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${timestamp}${extension}`);
      },
    });

    super(store, limit);
  }
}
