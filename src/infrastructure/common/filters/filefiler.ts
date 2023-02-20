export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (file) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      file.fileValidationError = 'only image files allowed';
      return callback(null, false);
    }
    callback(null, true);
  } else {
    callback(null, false);
  }
};
