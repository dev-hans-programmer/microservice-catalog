export interface FileData {
  filename: string;
  fileData: Buffer | Uint8Array | Blob;
  contentType: string;
}

export interface FileStorage {
  upload(data: FileData): Promise<void>;
  delete(filename: string): Promise<void>;
  getObjectUri(filename: string): string;
}
