import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";



@NgModule({
  declarations: [
    ArticleCardComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MatProgressSpinnerModule
    ],
  exports: [
    ArticleCardComponent,
  ]
})
export class SharedModule { }
