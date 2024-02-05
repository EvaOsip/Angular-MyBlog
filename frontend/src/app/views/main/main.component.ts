import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../shared/services/product.service";
import {ProductType} from "../../../types/product.type";
import {OwlOptions} from "ngx-owl-carousel-o";
import {DefaultResponseType} from "../../../types/default-response.type";
import {RequestsType} from "../../../types/requests.type";
import {FormBuilder, Validators} from "@angular/forms";
import {RequestsService} from "../../shared/services/requests.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  isPopupWithSelect: boolean = false
  loading: boolean = false;
  showNavigationArrows = true;
  customOptionsRev: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 26,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      800: {
        items: 2
      },
      1200: {
        items: 3
      },
    },
    nav: false
  }
  reviews = [
    {
      image: 'review1.png',
      name: 'Станислав',
      description: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
    },
    {
      image: 'review2.png',
      name: 'Алёна',
      description: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, сразу хочется выложить в сеть.',
    },
    {
      image: 'review3.png',
      name: 'Мария',
      description: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
    },

  ]
  responseSuccess: boolean = false;
  isErrorRequest = false;
  private data: RequestsType | {} = {};
  services = [
    {
      image: 'site.png',
      title: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7500'
    },
    {
      image: 'production.png',
      title: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3500'
    },
    {
      image: 'advertising.png',
      title: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: '1000'
    },
    {
      image: 'copywriting.png',
      title: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: '750'
    }
  ]
  articles: ProductType[] = [];
  serviceText: string = '';

  consultationForm = this.fb.group({
    service: [''],
    name: ['', [Validators.required, Validators.pattern('^[А-Яа-я][а-яё]*$')]],
    phone: ['', [Validators.required, Validators.pattern('^[+]?([0-9]{12})$')]],
  })

  constructor(private productService: ProductService,
              private fb: FormBuilder,
              private requestsService: RequestsService) {
  }

  ngOnInit(): void {
    this.productService.getPopular()
      .subscribe({
        next: (data: ProductType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }
          this.articles = data as ProductType[];
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  makeRequestFromSlider(): void {
    this.data = {
      name: this.consultationForm.get('name')?.value,
      phone: this.consultationForm.get('phone')?.value,
      type: "order",
      service: this.serviceText
    }
    if (this.consultationForm.valid) {
      this.requestsService.createRequests((this.data as RequestsType))
        .subscribe({
          next: (response: DefaultResponseType) => {
            if (response.error) {
              setTimeout(() => {
                this.isErrorRequest = true;
              }, 3000);
              this.responseSuccess = false;
            } else {
              this.responseSuccess = true;
            }
          },
          error: (error) => {
            console.log(error)
            this.responseSuccess = false;
            this.isErrorRequest = true;
          }
        })
    }
  }

  changeServices(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.serviceText = selectElement.value;
  }

  closePopup(): void {
    this.loading = false;
    this.isPopupWithSelect = false
  }

  openPopup(service: string): void {
    this.loading = true;
    this.responseSuccess = false
    this.serviceText = service
  }

  openPopupWithSelect(service: string): void {
    this.isPopupWithSelect = true
    this.loading = true;
    this.responseSuccess = false
    this.serviceText = service
  }
}
