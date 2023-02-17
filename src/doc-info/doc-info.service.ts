import { Injectable } from '@angular/core';
import {v4} from 'uuid'
import {DocFile, DocInfo} from "./doc-info";
import {LocalstorageService} from "../localstorage/localstorage.service";
@Injectable({
  providedIn: 'root'
})
export class DocInfoService {

  constructor(private lss: LocalstorageService) { }

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


  private updateBase64(DocId: string, FileId: string, base64Content: string | ArrayBuffer | null): void {
    let doc = this.documents.get(DocId);
    if(doc && doc.content.get(FileId)) {
      doc.content.get(FileId)!.base64 = base64Content;
    }
  }
}

