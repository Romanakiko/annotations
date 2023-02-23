import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DocumentViewRoutingModule} from "./document-view-routing.module";
import { DocumentViewComponent } from './document-view/document-view.component';
import {MatIconModule} from "@angular/material/icon";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {AnnotationService} from "./annotation/annotation.service";



@NgModule({
  declarations: [
    DocumentViewComponent
  ],
  imports: [
    CommonModule,
    DocumentViewRoutingModule,
    MatIconModule,
    DragDropModule
  ],
  providers: [
    AnnotationService
  ]
})
export class DocumentViewModule { }
