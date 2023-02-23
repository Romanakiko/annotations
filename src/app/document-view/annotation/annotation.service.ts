import {Injectable} from '@angular/core';
import {v4} from 'uuid'
import {Annotation} from "./annotation";
import {LocalstorageService} from "../../../localstorage/localstorage.service";
import {DocFile} from "../../../doc-info/doc-info";

@Injectable()
export class AnnotationService {

  constructor(private lss: LocalstorageService) {
    this.annotations = this.lss.getAnnotations();
    this.accord = this.lss.getFileToAnnotations();
  }

  private accord = new Map<string, string[]>();
  private annotations = new Map<string, Annotation>()


  newAnnotation(xPos: number, yPos: number, fileId: string) {
    let id = v4();
    let annotation = <Annotation>{
      id: id,
      position: {x: xPos, y: yPos},
      color: '#2a2ac2'
    }
    this.annotations.set(id, annotation);
    let ofFileList = this.accord.get(fileId);
    if(ofFileList) {
      ofFileList.push(id);
      this.accord.delete(fileId);
      this.accord.set(fileId, ofFileList);
    }
    else {
      this.accord.set(fileId, [id]);
    }
    this.lss.updateAnnotations(this.annotations);
    this.lss.updateFileToAnnotations(this.accord);
  }

  updateOptions(options: {color?: string,
                          size?: {height: number, width: number},
                          position?: {x: number, y: number},
                          positionDocument?: {x: number, y: number} },
                annotationId: string): void {
    let annotation = this.annotations.get(annotationId);
    if(!annotation) {
      return;
    }
    annotation.color = options.color ?? annotation.color;
    annotation.size = options.size ?? options.size;
    annotation.position = (options.position ?? options.position)!;
    annotation.positionDocument = options.positionDocument ?? options.positionDocument;
    this.annotations.delete(annotationId);
    this.annotations.set(annotation.id, annotation);
    this.lss.updateAnnotations(this.annotations);
  }

  updateContent(content: {text?: string, image: File}, annotationId: string): void {
    let annotation = this.annotations.get(annotationId);
    if(!annotation) {
      return;
    }
    annotation.text = content.text ?? annotation.text;
    if(content.image) {
      let imgId = v4();
      let reader = new FileReader();
      reader.readAsDataURL(content.image);
      reader.onload = () => this.updateBase64(annotationId, imgId, reader.result);
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
      annotation.image = <DocFile>{
        id: imgId,
        file: content.image,
        type: content.image.type,
        name: content.image.name
      };
    }

    setTimeout(() => this.lss.updateAnnotations(this.annotations), 500);
  }

  deleteAnnotation(annotationId: string, fileId: string): void {
    this.annotations.delete(annotationId);
    let ofFileList = this.accord.get(fileId);
      if(ofFileList) {
        this.accord.delete(fileId);
        this.accord.set(fileId, ofFileList.filter(i => i !== annotationId));
      }
    this.lss.updateAnnotations(this.annotations);
    this.lss.updateFileToAnnotations(this.accord);
  }

  getAnnotations(fileId: string): Annotation[] {
    let annotationsList = this.accord.get(fileId);
    if(annotationsList) {
      return annotationsList.map(id => (this.annotations.get(id) ?? <Annotation>{}))
    }
    else return [];
  }

  getAnnotationById(annotationId: string): Annotation {
    return this.annotations.get(annotationId) ?? <Annotation>{};
  }

  grab(annotationId: string, isDowned: boolean) {
    let annotation = this.annotations.get(annotationId);
    if(!annotation) {
      return;
    }
    annotation.downed = isDowned;
  }

  private updateBase64(AnnotationId: string, FileId: string, base64Content: string | ArrayBuffer | null): void {
    let annotation = this.annotations.get(AnnotationId);
    if(annotation && annotation.image) {
      annotation.image.base64 = base64Content;
    }
  }
}
