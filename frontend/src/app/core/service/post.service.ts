import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../config/config';
import { Observable } from 'rxjs';
import { Post } from '../interface/model/post';
import { ApiResponse } from '../interface/response/apiResponse';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiURL = API_URL + 'api/v1/post'

  constructor(private http: HttpClient) { }

  create<T>(post: Post): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.apiURL, post)
  }

  findByID<T>(id: string): Observable<ApiResponse<T>> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<ApiResponse<T>>(url);
  }

  // findByIDs(id: string): ApiResponse {
  //   const url = `${this.apiURL}/${id}`;
  //   return this.http.get<ApiResponse>(url);
  // }

  findAll<T>(): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(this.apiURL);
  }

  update<T>(id: string, post: Post): Observable<ApiResponse<T>> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<ApiResponse<T>>(url, post);
  }

  delete<T>(id: string): Observable<ApiResponse<T>> {
    const url = `${this.apiURL}/${id}`;
    return this.http.delete<ApiResponse<T>>(url);
  }
}