import { Injectable } from '@angular/core';
import {v4} from 'uuid'
import {DocFile, DocInfo, DocInfoShort} from "./doc-info";
import {LocalstorageService} from "../localstorage/localstorage.service";
@Injectable({
  providedIn: 'root',
})
export class DocInfoService {

  constructor(private lss: LocalstorageService) {
    this.loadDocuments();
  }

  private documents = new Map<string, DocInfo>;

  newDocument(docName: string, files: File[]): void {
    let docFiles = new Map<string, DocFile>;
    let docId = v4();

    files.forEach(file => {
      let fileId = v4();
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => this.updateBase64(docId,fileId, reader.result);
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
      let docFile = <DocFile>{
        id: fileId,
        file: file,
        type: file.type,
        name: file.name
      }
       docFiles.set(docFile.id, docFile);
    })
    let doc: DocInfo = {
      name: docName,
      id: docId,
      content: docFiles
    }
    this.documents.set(doc.id, doc);
    setTimeout(() => this.lss.updateDocuments(this.documents), 500);
  }

  deleteDocument(docId: string): void {
    this.documents.delete(docId);
    setTimeout(() => this.lss.updateDocuments(this.documents), 0);
  }

  getDocList(): DocInfoShort[] {
    return Array.from(this.documents.values()).map(doc => ({
      id: doc.id,
      name: doc.name
    }))
  }

  getDoc(docId: string | null): DocInfo | undefined {
    if(!docId) {
      console.error('No id sent to DocInfo service!')
      return <DocInfo>{}
    }
    return this.documents.get(docId);
  }

  private loadDocuments(): void {
    this.documents = this.lss.getDocuments();
    for(let doc of this.documents) {
      for(let docFile of doc[1].content) {
        this.base64ToFile(docFile[1].base64, docFile[1].name, docFile[1].type).then(fileInfo => {
          this.updateFiles(doc[1].id, docFile[1].id, fileInfo);
        })
      }
    }
  }

  private updateBase64(DocId: string, FileId: string, base64Content: string | ArrayBuffer | null): void {
    let doc = this.documents.get(DocId);
    if(doc && doc.content.get(FileId)) {
      doc.content.get(FileId)!.base64 = base64Content;
    }
  }

  private async base64ToFile(base64: string | ArrayBuffer | null | undefined, fileName: string | undefined, type: string | undefined): Promise<File> {
    if(!base64) {
      return Promise.reject( (e: any) =>
        console.log('No base64 on ', fileName, 'error: ', e)
      );
    }
    if(!fileName) {
      return Promise.reject( (e: any) =>
        console.log('No fileName on ', fileName, 'error: ', e)
      );
    }
    if(!type) {
      return Promise.reject( (e: any) =>
        console.log('No type on ', fileName, 'error: ', e)
      );
    }
    const res: Response = await fetch(base64 as string);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: type });
  }

  private updateFiles(DocId: string, FileId: string, fileContent: File): void {
    let doc = this.documents.get(DocId);
    if(doc && doc.content.get(FileId)) {
      doc.content.get(FileId)!.file = fileContent;
    }
  }
}

