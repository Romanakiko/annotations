import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DocumentViewRoutingModule} from "./document-view-routing.module";
import { DocumentViewComponent } from './document-view/document-view.component';
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [
    DocumentViewComponent
  ],
  imports: [
    CommonModule,
    DocumentViewRoutingModule,
    MatIconModule
  ]
})
export class DocumentViewModule { }
