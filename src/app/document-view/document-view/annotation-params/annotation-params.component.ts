import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AnnotationService} from "../../annotation/annotation.service";
import {FormControl} from "@angular/forms";
import {Annotation} from "../../annotation/annotation";

@Component({
  selector: 'app-annotation-params',
  templateUrl: './annotation-params.component.html',
  styleUrls: ['./annotation-params.component.scss']
})
export class AnnotationParamsComponent{

  @Input()
  set annotationId(annotationId: string) {
    if(annotationId){
      this.Id = annotationId;
      this.setOptions(this.annotationService.getAnnotationById(annotationId));
    }
  }

  get annotationId() {
    return this.Id ?? '';
  }

  Id?: string;
  height: number = 10;
  width: number = 10;
  image?: File;
  imgSrc?: string | ArrayBuffer | null;
  opacity: number = 1;
  color: string = '';
  colors: string[] = ['#ff3c2c', '#ff842c', '#ffed2c', '#6bef4b', '#2cffff', '#2a2ac2', '#b22cff'];
  success = false;
  text = new FormControl();


  constructor(private annotationService: AnnotationService) {
  }

  setOptions(annotation: Annotation): void {
    this.height = annotation.size.height;
    this.width = annotation.size.width;
    this.image = annotation.image?.file;
    this.opacity = annotation.opacity;
    this.color = annotation.color;
    this.imgSrc = undefined;
    this.text.setValue(annotation.text);
    if(annotation.image?.base64) {
      this.imgSrc = annotation.image?.base64;
    }
    else {
      this.getUrl();
    }
  }

  onFileSelected(event: any) {
    if(!event.target.files[0].type.match("image.*")) {
      console.error('Not avalible file type');
      return;
    }
    this.image = event.target.files[0];
    this.getUrl();
  }

  getUrl() {
    if(!this.image) {
      return;
    }
    let fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent) => {
      if(fileLoadedEvent.target) {
        this.imgSrc = fileLoadedEvent.target.result;
      }
    }
    fileReader.readAsDataURL(this.image as File);
  }

  deleteImg() {
    this.image = undefined;
    this.imgSrc = undefined;
  }

  saveAnnotation() {
    setTimeout(() => this.annotationService.updateContent({
      image: this.image as File,
      text: this.text.value
    }, this.annotationId), 0);

    setTimeout(() => this.annotationService.updateOptions({
      opacity: this.opacity,
      size: {height: this.height, width: this.width},
      color: this.color
    }, this.annotationId), 0);

    this.success = true;
    setTimeout(() => this.success = false, 2000);
  }

}
