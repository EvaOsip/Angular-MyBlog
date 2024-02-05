import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ProductType} from "../../../types/product.type";
import {ActiveParamsType} from "../../../types/active-params.type";
import {ArticleType} from "../../../types/article.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}

  getProducts(params: ActiveParamsType): Observable<{ count: number, pages: number, items: ProductType[]} | DefaultResponseType> {
    return this.http.get<{ count: number, pages: number, items: ProductType[]} | DefaultResponseType>(environment.apiHost + 'articles', {
      params: params
    })
  }

  getProduct(url: string): Observable<ArticleType | DefaultResponseType> {
    return this.http.get<ArticleType | DefaultResponseType>(environment.apiHost + 'articles/' + url)
  }

  getRelatedProducts(url: string): Observable<ProductType[] | DefaultResponseType> {
    return this.http.get<ProductType[] | DefaultResponseType>(environment.apiHost + 'articles/related/' + url)
  }

  getPopular(): Observable<ProductType[] | DefaultResponseType> {
    return this.http.get<ProductType[] | DefaultResponseType>(environment.apiHost + 'articles/top')
  }

}
