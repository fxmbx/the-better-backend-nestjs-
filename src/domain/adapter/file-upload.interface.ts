export interface IFileUploadInterface {
  uploadFile(filename: string, fileobject: any): Promise<string>;

  deleteFile(key: string);
}
