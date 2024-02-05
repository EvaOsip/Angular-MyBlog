import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {RequestsType} from "../../../types/requests.type";

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  constructor(private http: HttpClient) {
  }

  createRequests(params: RequestsType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.apiHost + 'requests', params)
  }
}
