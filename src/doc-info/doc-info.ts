export interface DocInfoShort {
  id: string,
  name: string
}

export interface DocInfo extends DocInfoShort{
  content: Map <string, DocFile>
}

export interface StoredDocInfo{
  id: string,
  name: string,
  content: DocFile[]
}

export interface DocFile {
  id: string,
  file: File,
  name?: string,
  type?: string,
  base64?: string | ArrayBuffer | null
}
