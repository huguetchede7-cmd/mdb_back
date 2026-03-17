import * as path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand, ObjectCannedACL, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Request } from 'express';
import Messengers from './messengers';
import {FILE_CONFIG, FILE_CONFIG_WITH_PDF, FILE_CONFIG_WITH_PDF_AND_DOC} from '../../config/fileconfig';
import { UploadedFile } from 'express-fileupload';
import { Readable } from 'stream';
import { LogHelpers } from './LogHelpers';

interface FileHelpersOptions {
    allowedExtensions: RegExp;
    maxFileSize: number;
    maxFileSizeStr: string;
}

class FileHelpers {
  static DEFAULT_FILE_OPTIONS: FileHelpersOptions = {
    allowedExtensions: FILE_CONFIG.allowedImageExtensions,
    maxFileSize: FILE_CONFIG.maxFileSize,
    maxFileSizeStr: FILE_CONFIG.maxFileSizeStr,
  }

  static DEFAULT_FILE_OPTIONS_WITH_PDF: FileHelpersOptions = {
    allowedExtensions: FILE_CONFIG_WITH_PDF.allowedImageExtensions,
    maxFileSize: FILE_CONFIG_WITH_PDF.maxFileSize,
    maxFileSizeStr: FILE_CONFIG_WITH_PDF.maxFileSizeStr,
  }

  static DEFAULT_FILE_OPTIONS_WITH_PDF_AND_DOC: FileHelpersOptions = {
    allowedExtensions: FILE_CONFIG_WITH_PDF_AND_DOC.allowedImageExtensions,
    maxFileSize: FILE_CONFIG_WITH_PDF_AND_DOC.maxFileSize,
    maxFileSizeStr: FILE_CONFIG_WITH_PDF_AND_DOC.maxFileSizeStr,
  }

  static async verify(req: Request, target: string = 'images', options: FileHelpersOptions = FileHelpers.DEFAULT_FILE_OPTIONS) {
      const result = { statut: true, errors: {[target] : ""} };

      // Check if image exists
      if (!req.files || !req.files[target]) {
          result.statut = false;
          result.errors = { [target]: Messengers.error.champs.requis };
          return result;
      }

      // Getting all images into array format
      const imageList = Array.isArray(req.files[target]) ? req.files[target] : [req.files[target]];

      // Check if at least one image is set
      if (imageList.length < 1) {
          result.statut = false;
          result.errors = { [target]: 'Importez au moins une image' };
          return result;
      }

      // Check file extensions and size
      for (const file of imageList) {
          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          if (fileExtension && !options.allowedExtensions.test(fileExtension)) {
              result.statut = false;
              result.errors = { [target]: `${file.name} (${Messengers.error.image.mimes_img})` };
              return result;
          }
          if (file.size > options.maxFileSize) {
              result.statut = false;
              result.errors = { [target]: `${file.name} (${Messengers.error.image.max_size} ${options.maxFileSizeStr})` };
              return result;
          }
      }

      return result;
  }

  static async save(file: UploadedFile): Promise<string> {
    try {
      const s3 = new S3Client({
        region: process.env.AWS_DEFAULT_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }
      })

      const fileExtension = path.extname(file.name)
      const newFilename = `${Date.now()}-${uuidv4()}${fileExtension}`

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET!,
        Key: newFilename,
        Body: file.data,
        ACL: "public-read" as ObjectCannedACL,
        ContentType: file.mimetype
      }

      // Téléversement sur S3 avec AWS SDK v3
      const command = new PutObjectCommand(uploadParams)
      await s3.send(command)
      return newFilename

    } catch (error) {
      console.error("Erreur lors de l'upload vers S3 :", error)
      return ""
    }
  }

  static async saveAsAvif(file: UploadedFile, compressLevel = 20): Promise<string | null> {
    try {
      const s3 = new S3Client({ 
        region: process.env.AWS_DEFAULT_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }
      });

      // Générer un nouveau nom de fichier
      const newFilename = `${Date.now()}-${uuidv4()}.avif`;

      // Conversion en AVIF avec sharp
      const avifBuffer = await sharp(file.data)
        .avif({ quality: compressLevel }) // qualité ajustable
        .toBuffer();

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET!,
        Key: newFilename,
        Body: avifBuffer,
        ACL: "public-read" as ObjectCannedACL,
        ContentType: "image/avif"
      };

      await s3.send(new PutObjectCommand(uploadParams));
      return newFilename;

    } catch (error) {
      console.error("Erreur upload AVIF:", error);
      return null;
    }
  }

  static formatToUrl(filename: string): string {
    if (filename && filename.indexOf('http') !== -1) {
        return filename;
    }
    return `${process.env.AWS_S3_BUCKET_PREFIX}/${filename}`;
  }

  static async delete(filename: string): Promise<void> {
    try {
      const s3 = new S3Client({
        region: process.env.AWS_DEFAULT_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }
      })

      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET!,
        Key: filename
      })
      await s3.send(command)
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier :", error)
    }
  }

  static async getFileStream(filename: string) : Promise<Readable | null> {
    try {
      const s3 = new S3Client({
        region: process.env.AWS_DEFAULT_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }
      })

      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET!,
        Key: filename
      })

      const response = await s3.send(command)
      if (!response.Body) {
        throw new Error('No file content received from S3')
      }

      return response.Body as Readable
    } catch (error) {
      LogHelpers.showException(error as Error)
      return null
    }
  }

  static getPreview(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    let filePreview = filename;

    if (extension == 'pdf') {
      filePreview = "icon_pdf.png"
    }
    if (extension == 'doc' || extension == 'docx') {
      filePreview = "icon_doc.png"
    }
    if (extension == 'xls' || extension == 'xlsx') {
      filePreview = "icon_xls.png"
    }
    if (extension == 'ppt' || extension == 'pptx') {
      filePreview = "icon_ppt.png"
    }

    return FileHelpers.formatToUrl(filePreview)
  }
}

export default FileHelpers
