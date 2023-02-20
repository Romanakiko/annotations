import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DocumentViewComponent} from "./document-view/document-view.component";

const routes: Routes = [
  {
    path: '',
    component: DocumentViewComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentViewRoutingModule { }
