import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {CategoryService} from "../../../shared/services/category.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {debounceTime} from "rxjs";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CategoryType} from "../../../../types/category.type";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  products: ProductType[] = [];
  categories: CategoryType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: CategoryType[] = [];
  open = false;
  pages: number[] = [];

  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe((data: CategoryType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        } else {
          this.categories = data as CategoryType[];
          this.activatedRoute.queryParams
            .pipe(
              debounceTime(500)
            )
            .subscribe(params => {
              this.activeParams = ActiveParamsUtil.processParams(params);
              this.appliedFilters = [];
              this.activeParams.categories.forEach(url => {
                const foundType = this.categories.find(category => category.url === url);
                if (foundType) {
                  this.appliedFilters.push(foundType);
                }
              });
              this.processCatalog();
            });
        }
      }, (error) => {
        console.error(error);
        this.processCatalog();
      });
  }

  processCatalog(): void {
    this.productService.getProducts(this.activeParams)
      .subscribe((data: { count: number, pages: number, items: ProductType[]} | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        let products = data as { count: number, pages: number, items: ProductType[]}
        this.pages = [];
        for (let i = 1; i <= products.pages; i++) {
          this.pages.push(i)
        }
        console.log(this.pages)
        this.products = products.items;
        console.log(this.products)
      })
}

  removeAppliedFilter(appliedFilter: CategoryType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.url)
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  toggle(): void {
    this.open = !this.open
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openNextPage(): void {
    if(!this.activeParams.page) {
      this.activeParams.page = 1;
    }
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  updateFilterParam(url: string, checked: boolean) {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingTypeInParams = this.activeParams.categories.find(item => item === url);
      if (existingTypeInParams && !checked) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if (!existingTypeInParams && checked) {
        this.activeParams.categories = [...this.activeParams.categories, url]
      }
    } else if (checked) {
      this.activeParams.categories = [url];
    }
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

}
