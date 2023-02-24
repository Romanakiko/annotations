import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DocInfoService} from "../../../doc-info/doc-info.service";
import {Subscription} from "rxjs";
import {DocFile, DocInfo} from "../../../doc-info/doc-info";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {AnnotationService} from "../annotation/annotation.service";
import {Annotation} from "../annotation/annotation";
import {CdkDragEnd} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.scss']
})
export class DocumentViewComponent implements OnInit, OnDestroy{
  constructor(private route: ActivatedRoute,
              private router: Router,
              private docInfo: DocInfoService,
              private annotationService: AnnotationService,
              private sanitizer: DomSanitizer) {
  }

  subscriptions: Subscription[] = [];
  document: DocInfo | undefined = <DocInfo>{};
  files: DocFile[] = [];
  currentPage = 1;
  currentAnnotationId?: string;
  // delta_y = 0;

  ngOnInit() {
    this.subscriptions.push(
      this.route.paramMap.subscribe( params => {
        this.document = this.docInfo.getDoc(params.get('id'));
        if(this.document) {
          this.files = Array.from(this.document.content.values());
        }
      })
    );
  }

  findFile(fileId: string): SafeUrl {
    if(!this.document || !this.document.content.has(fileId) || !this.document.content.get(fileId)!.file) {
      return <SafeUrl> {}
    }
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.document.content.get(fileId)!.file));
  }

  scrollTo(direction: number) {
    if(direction > 0) {
      this.currentPage++;
    }
    else this.currentPage--;
    let el = document.getElementById(this.files[this.currentPage - 1].id);
    el?.scrollIntoView({behavior: "smooth", block: "start", inline: "center"});
  }

  zoomTo(direction: number, Id: string) {
    let el = document.getElementById(Id);
    if(el) {
      if(direction > 0)
        el.style.transform = "scale(1.5)";
      else if(direction === 0) {
        el.style.transform = "scale(1)";
      }
      else el.style.transform = "scale(0.5)";
    }
  }

  // clearPos(obj_event: any, annotationId: string) {
  //   this.annotationService.grab(annotationId, false);
  // }
  // savePos(obj_event: any, annotationId: string) {
  //   this.annotationService.grab(annotationId, true);
  //   if (obj_event) {
  //     this.annotationService.updateOptions({positionDocument:{x: 0, y: obj_event.pageY}}, annotationId);
  //   }
  //   let el = (obj_event.target || obj_event.srcElement);
  //   this.delta_y = el.offsetTop;
  // }
  // moveSize(obj_event: any, annotationId: string) {
  //   let y = 0;
  //   if (this.annotationService.getAnnotationById(annotationId).downed) {
  //     if (obj_event) {
  //       y = obj_event.pageY
  //       this.annotationService.updateOptions({positionDocument:{x: 0, y: y}}, annotationId);
  //     }
  //     var new_y = this.delta_y + y;
  //     let el = (obj_event.target || obj_event.srcElement);
  //     this.annotationService.updateOptions({size: {height: new_y, width: 0}}, annotationId);
  //     el.style.height = new_y + "px";
  //   }
  // }

  createAnnotation(event: any, fileId: string): void {
    let rect = event.target.getBoundingClientRect();
    let xPos = event.pageX - rect.left;
    let yPos = event.pageY - rect.top;
    this.annotationService.newAnnotation(xPos, yPos, fileId);
    // let xMax = event.target.clientWidth;
    // let yMax = event.target.clientHeight;
    // this.xPos = Math.round(xPos * 100 / xMax);
    // this.yPos = Math.round(yPos * 100 / yMax);
    // console.log('doc= ',this.xPos, this.yPos)
  }

  savePosition(event: CdkDragEnd, annotationId: string) {
    this.annotationService.updateOptions({position: event.dropPoint}, annotationId);
  }

  openAnnotation(annotationId: string) {
    if(this.currentAnnotationId === annotationId) {
      this.currentAnnotationId = undefined;
    }
    else {
      this.currentAnnotationId = annotationId;
    }
  }

  getAnnotations(fileId: string): Annotation[] {
    return this.annotationService.getAnnotations(fileId);
  }

  deleteAnnotation(annotationId: string, fileId: string) {
    this.annotationService.deleteAnnotation(annotationId, fileId);
    this.currentAnnotationId = undefined;
  }

  delete() {
    this.docInfo.deleteDocument(this.document?.id as string);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
