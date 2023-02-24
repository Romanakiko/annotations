import {Component, OnInit} from '@angular/core';
import {DocInfoService} from "../../doc-info/doc-info.service";
import {DocInfoShort} from "../../doc-info/doc-info";

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit{

  constructor(private docInfo: DocInfoService) {
  }

  docList: DocInfoShort[] = []

  ngOnInit(): void {
     this.docList = this.docInfo.getDocList();
  }

  openDocument(docId: string): void {

  }

}
