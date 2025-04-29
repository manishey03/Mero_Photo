import path from 'path';
import multer from 'multer';

//
import type { Request } from 'express';
import type { Multer, StorageEngine } from 'multer';

//
import { BadRequestError } from '../api/apiError';

//
export interface FileUploadInterface {
  uploadFile(): Multer;
}

/**
 * File upload base class
 */
export class FileUploadBase implements FileUploadInterface {
  private store: StorageEngine;
  private limit: number;

  constructor(storage: StorageEngine, limit?: number) {
    this.store = storage;
    this.limit = limit ?? 25 * 1024 * 1024; // maximum file size (35 mb)
  }

  fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', 
      '.webp', '.svg', '.ico', '.heic', '.heif', '.avif'
    ];
    
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      return cb(new BadRequestError('Only images can be uploaded.'));
    }
  };

  //
  uploadFile(): Multer {
    return multer({
      storage: this.store,
      fileFilter: this.fileFilter,
      limits: { fileSize: this.limit },
    });
  }
}
