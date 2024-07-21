import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interface/response/apiResponse';
import { LikeResponse } from '../interface/response/likeResponse';
import { LikeRequest } from '../interface/request/like-request';
import { API_URL } from '../../core/config/config';

@Injectable({
  providedIn: 'root'
})
export class LikeApiService {
  private apiURL = API_URL + 'api/v1/likes'

  constructor(private http: HttpClient) { }

  toggle(likeRequest: LikeRequest): Observable<ApiResponse<LikeResponse>> {
    return this.http.post<ApiResponse<LikeResponse>>(`${this.apiURL}/toggle`, likeRequest);
  }

  isLiked(likeRequest: LikeRequest): Observable<ApiResponse<boolean>> {
    const params = new HttpParams()
      .set('postId', likeRequest.postID!);

    return this.http.get<ApiResponse<boolean>>(`${this.apiURL}/is-liked`, { params });
  }

  countLikes(postId: string): Observable<ApiResponse<number>> {
    const params = new HttpParams()
      .set('postId', postId);

    return this.http.get<ApiResponse<number>>(`${this.apiURL}/count-likes`, { params });
  }
}