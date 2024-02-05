import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {PopularType} from "../../../../types/popular.type";
import {ProductType} from "../../../../types/product.type";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {
  @Input() article!: ProductType;
  serverStaticPath = environment.serverStaticPath

  ngOnInit() {
  }
}

