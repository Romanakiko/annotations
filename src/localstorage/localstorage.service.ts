import { Injectable } from '@angular/core';
import { DocInfo, StoredDocInfo} from "../doc-info/doc-info";

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  getDocuments(): Map<string, DocInfo> {
    let documentArr = JSON.parse(localStorage.getItem('documents') as string) as StoredDocInfo[];
    if(!documentArr.length) {
      return new Map<string, DocInfo>();
    }
    let docs = new Map<string, DocInfo>(documentArr.map(doc => [
      doc.id,
       {
         id: doc.id,
         name: doc.name,
         content: new Map(doc.content.map(docFile => [docFile.id,docFile]))
       }
    ]))
    return docs;
  }

  updateDocuments(documents: Map<string, DocInfo>): void {
    let storedDocs = Array.from(documents.values()).map<StoredDocInfo>(i => ({
      id: i.id,
      name: i.name,
      content: Array.from(i.content.values())
    }))

    localStorage.setItem('documents', JSON.stringify(storedDocs));
  }

}
