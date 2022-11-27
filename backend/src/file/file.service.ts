import { createReadStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import { extname } from 'path';
import {
  FileTypeValidator,
  Injectable,
  InternalServerErrorException,
  MaxFileSizeValidator,
  ParseFilePipe,
  StreamableFile,
} from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { User } from '@prisma/client';
import { Request } from 'express';
import { diskStorage } from 'multer';

@Injectable()
export class FileService {
  static multerOptions = (): MulterOptions => ({
    storage: diskStorage({
      destination: (req: Request & { user?: { user?: User } }, file, cb) => {
        if (req.user?.user === undefined) {
          throw new InternalServerErrorException('Error in multerOptions');
        }
        const dir = `./upload/${req.user.user.id}/`;
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
      },
      filename: (req: Request & { user?: { user?: User } }, file, cb) => {
        if (req.user?.user === undefined) {
          throw new InternalServerErrorException('Error in multerOptions');
        }
        cb(null, `${req.user.user.name}${extname(file.originalname)}`);
      },
    }),
  });

  static parseFilePipe = (): ParseFilePipe =>
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10000000 }),
        new FileTypeValidator({ fileType: /jpeg|png|jpg/ }),
      ],
    });

  streamFile(path: string): StreamableFile {
    const file = createReadStream(path);

    return new StreamableFile(file);
  }

  deleteOldFile(newFilename: string, user: User): void {
    const oldExtname = extname(user.avatarUrl);
    if (oldExtname !== extname(newFilename)) {
      const oldFilePath = `./upload/${user.id}/${user.name}${oldExtname}`;
      if (existsSync(oldFilePath)) {
        unlinkSync(oldFilePath);
      }
    }
  }
}
