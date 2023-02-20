import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NewDocumentComponent} from "./new-document/new-document.component";
import {DocumentListComponent} from "./document-list/document-list.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'new-document',
    pathMatch: 'full'
  },
  {
    path: 'new-document',
    component: NewDocumentComponent
  },
  {
    path: 'document-list',
    component: DocumentListComponent
  },
  {
    path: 'document-view/:id',
    loadChildren: () => import('./document-view/document-view.module').then(m => m.DocumentViewModule)
  },
  {
    path: '**',
    redirectTo: 'new-document'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
