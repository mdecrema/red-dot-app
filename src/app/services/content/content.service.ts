import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IContent } from 'src/app/models/IContent';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  constructor(private readonly httpClient: HttpClient) {}

  getContents(): Observable<IContent[]> {
    return this.httpClient.get<IContent[]>(environment.apiUri);
  }
}
