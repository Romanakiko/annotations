import { Injectable } from '@angular/core';
import {DocFile, DocInfo} from "../doc-info/doc-info";

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  getBase64(file: File) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };

    // fetch(url)
    //   .then(res => res.blob())
    //   .then(blob => {
    //     const file = new File([blob], "File name",{ type: "image/png" })
    //   })
  }

  getDocuments(): DocInfo[] {
    if(!localStorage.getItem('documents')) {
      return [];
    }
    return  JSON.parse(localStorage.getItem('documents') as string) as DocInfo[];
  }

  updateDocuments(documents: Map<string, DocInfo>): void {
    // let docs = documents.map(document =>
    //   document.content.map(docFile => {
    //     let res: DocFile = docFile;
    //     let reader = new FileReader();
    //     reader.readAsDataURL(docFile.file);
    //     reader.onload = function () {
    //       if(reader.result) {
    //         res.name = docFile.file.name;
    //         res.type = docFile.file.type;
    //         res.base64 = reader.result.toString();
    //       }
    //     };
    //     reader.onerror = function (error) {
    //       console.log('Error: ', error);
    //     };
    //     return res;
    // }))
    console.log('docs = ', documents)
    let storedDocs = Array.from(documents.values()).map(i => ({
      id: i.id,
      name: i.name,
      content: Array.from(i.content.entries())
    }))

    localStorage.setItem('documents', JSON.stringify(storedDocs));
  }
}
