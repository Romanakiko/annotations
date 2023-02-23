import { Component } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {DocInfoService} from "../doc-info/doc-info.service";

@Component({
  selector: 'app-new-document',
  templateUrl: './new-document.component.html',
  styleUrls: ['./new-document.component.scss']
})
export class NewDocumentComponent {
  files: File[] = [];
  documentNameControl = new FormControl('', [Validators.required]);
  showAddedSnack = false

  constructor(private docInfo: DocInfoService) {}

  onFileSelected(event: any): void {
    if(event) {
      for(let i = 0; i < event.target.files.length; i++) {
        this.files.push(event.target.files.item(i))
      }
    }
  }

  deleteAll(): void {
    this.files = [];
  }

  saveDoc(): void {
    if(this.documentNameControl.valid) {
      this.docInfo.newDocument(this.documentNameControl.value!, this.files);
    }
    this.files = [];
    this.showAddedSnack = true;
    setTimeout(() => {
      this.showAddedSnack = false;
      this.documentNameControl.reset();
    }, 2000);
  }
}
