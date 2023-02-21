import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DocInfoService} from "../../../doc-info/doc-info.service";
import {Subscription} from "rxjs";
import {DocFile, DocInfo} from "../../../doc-info/doc-info";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {EventData} from "@angular/cdk/testing";

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.scss']
})
export class DocumentViewComponent implements OnInit, OnDestroy{
  constructor(private route: ActivatedRoute,
              private router: Router,
              private docInfo: DocInfoService,
              private sanitizer: DomSanitizer) {
  }

  subscriptions: Subscription[] = [];
  document: DocInfo | undefined = <DocInfo>{};
  files: DocFile[] = []
  currentPage = 1;

  showZoom = false;
  xPos = 0;
  yPos = 0;

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

  openZoom(event: Event, show: boolean) {
    event.preventDefault();
    this.showZoom = show;
    if (show) {
      this.positionZoom(event);
    }
  }

  positionZoom(event: any) {
    let xPos = event.touches[0].pageX - event.touches[0].target.offsetLeft
    let yPos = event.touches[0].pageY - event.touches[0].target.offsetTop;
    let xMax = event.target.clientWidth;
    let yMax = event.target.clientHeight;
    this.xPos = this.validPercent(Math.round(xPos * 100 / xMax));
    this.yPos = this.validPercent(Math.round(yPos * 100 / yMax));
  }

  validPercent(value: number) {
    if (value < 0) {
      this.showZoom = false;
      return 0;
    }
    if (value > 100) {
      this.showZoom = false;
      return 100
    }
    return value;
  }

  test(event: any) {
    let rect = event.target.getBoundingClientRect();
    let xPos = event.pageX - rect.left;
    let yPos = event.pageY - rect.top;
    console.log('abs= ',xPos,yPos);
    let xMax = event.target.clientWidth;
    let yMax = event.target.clientHeight;
    this.xPos = Math.round(xPos * 100 / xMax);
    this.yPos = Math.round(yPos * 100 / yMax);
    console.log('doc= ',this.xPos, this.yPos)
  }

  delete() {
    this.docInfo.deleteDocument(this.document?.id as string);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
