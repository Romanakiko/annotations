import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DocumentViewRoutingModule} from "./document-view-routing.module";
import { DocumentViewComponent } from './document-view/document-view.component';
import {MatIconModule} from "@angular/material/icon";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {AnnotationService} from "./annotation/annotation.service";
import { AnnotationParamsComponent } from './document-view/annotation-params/annotation-params.component';
import {MatSliderModule} from "@angular/material/slider";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";



@NgModule({
  declarations: [
    DocumentViewComponent,
    AnnotationParamsComponent
  ],
  imports: [
    CommonModule,
    DocumentViewRoutingModule,
    MatIconModule,
    DragDropModule,
    MatSliderModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  providers: [
    AnnotationService
  ]
})
export class DocumentViewModule { }
