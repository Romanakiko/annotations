import {Injectable} from '@angular/core';
import {DocInfo, StoredDocInfo} from "../doc-info/doc-info";
import {Annotation, FileToAnnotations} from "../app/document-view/annotation/annotation";

@Injectable({
  providedIn: 'platform'
})
export class LocalstorageService {

  constructor() { }

  getDocuments(): Map<string, DocInfo> {
    let documentArr = JSON.parse(localStorage.getItem('documents') as string) as StoredDocInfo[];
    if(!documentArr || !documentArr.length) {
      return new Map<string, DocInfo>();
    }
    return new Map<string, DocInfo>(documentArr.map(doc => [
      doc.id,
      {
        id: doc.id,
        name: doc.name,
        content: new Map(doc.content.map(docFile => [docFile.id, docFile]))
      }
    ]));
  }

  updateDocuments(documents: Map<string, DocInfo>): void {
    let storedDocs = Array.from(documents.values()).map<StoredDocInfo>(i => ({
      id: i.id,
      name: i.name,
      content: Array.from(i.content.values())
    }))

    localStorage.setItem('documents', JSON.stringify(storedDocs));
  }

  getAnnotations(): Map<string, Annotation> {
    let annotations = JSON.parse(localStorage.getItem('annotations') as string) as Annotation[];
    if(!annotations || !annotations.length) {
      return new Map<string, Annotation>();
    }
    return new Map<string, Annotation>(annotations.map(annotation => [
      annotation.id,
      annotation
    ]));
  }

  getFileToAnnotations(): Map<string, string[]> {
    let accord = JSON.parse(localStorage.getItem('accordFileToAnnotations') as string) as FileToAnnotations[];
    if(!accord || !accord.length) {
      return new Map<string, string[]>();
    }
    return new Map<string, string[]>(accord.map(item => ([item.fileId, item.annotationIds])));
  }

  updateAnnotations(annotations: Map<string, Annotation>): void {
    let storedAnnotations = Array.from(annotations.values());

    localStorage.setItem('annotations', JSON.stringify(storedAnnotations));
  }

  updateFileToAnnotations(accord: Map<string, string[]>): void {
    let storedAccords: FileToAnnotations[] = Array.from(accord.entries()).map(a => ({
      fileId: a[0],
      annotationIds: a[1]
    }));

    localStorage.setItem('accordFileToAnnotations', JSON.stringify(storedAccords));
  }

}
