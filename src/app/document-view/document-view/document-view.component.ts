import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DocInfoService} from "../../../doc-info/doc-info.service";
import {Subscription} from "rxjs";
import {DocFile, DocInfo} from "../../../doc-info/doc-info";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

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

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
