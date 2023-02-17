export interface DocInfo {
  id: string,
  name: string,
  content: Map <string, DocFile>
}

export interface DocFile {
  id: string,
  file: File,
  name?: string,
  type?: string,
  base64?: string | ArrayBuffer | null
}
