import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { BlogComponent } from './blog/blog.component';
import { DetailComponent } from './detail/detail.component';
import {SharedModule} from "../../shared/shared.module";
import {CarouselModule} from "ngx-owl-carousel-o";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    BlogComponent,
    DetailComponent
  ],
  imports: [
    MatProgressSpinnerModule,
    CarouselModule,
    SharedModule,
    CommonModule,
    ProductRoutingModule
  ]
})
export class ProductModule { }
