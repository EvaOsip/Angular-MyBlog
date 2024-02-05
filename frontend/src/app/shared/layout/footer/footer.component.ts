import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {RequestsService} from "../../services/requests.service";
import {RequestsType} from "../../../../types/requests.type";
import {DefaultResponseType} from "../../../../types/default-response.type";


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  year: number = 2023;
  loading: boolean = false;
  responseSuccess: boolean = false;
  isErrorRequest = false;
  private data: RequestsType | {} = {};

  consultationForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern('^[А-Яа-я][а-яё]*$')]],
    phone: ['', [Validators.required, Validators.pattern('^[+]?([0-9]{12})$')]],
  })

  constructor(private fb: FormBuilder,
              private requestsService: RequestsService) {
  }

  ngOnInit() {
    const date = new Date;
    this.year = date.getFullYear();
  }

  closePopup(): void {
    this.loading = false;
  }

  openPopup(): void {
    this.loading = true;
    this.responseSuccess = false
  }

  makeCallRequest(): void {
    this.data = {
      name: this.consultationForm.get('name')?.value,
      phone: this.consultationForm.get('phone')?.value,
      type: "consultation"
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
}
