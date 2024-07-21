import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interface/response/apiResponse';
import { RoleResponse } from '../interface/response/role-response';
import { RoleRequest } from '../interface/request/role-request';
import { API_URL } from '../../core/config/config';

@Injectable({
  providedIn: 'root'
})
export class RoleApiService {
  private apiURL = API_URL + 'api/v1/roles'

  constructor(private http: HttpClient) { }

  create(roleRequest: RoleRequest): Observable<ApiResponse<RoleResponse>> {
    return this.http.post<ApiResponse<RoleResponse>>(this.apiURL, roleRequest)
  }

  findByID(roleRequestID: number): Observable<ApiResponse<RoleResponse>> {
    const url = `${this.apiURL}/${roleRequestID}`;
    return this.http.get<ApiResponse<RoleResponse>>(url);
  }

  findAll(): Observable<ApiResponse<RoleResponse[]>> {
    return this.http.get<ApiResponse<RoleResponse[]>>(this.apiURL);
  }

  update(roleRequestID: number, roleRequest: RoleRequest): Observable<ApiResponse<RoleResponse>> {
    const url = `${this.apiURL}/${roleRequestID}`;
    return this.http.put<ApiResponse<RoleResponse>>(url, roleRequest);
  }

  delete(roleRequestID: number): Observable<ApiResponse<RoleResponse>> {
    const url = `${this.apiURL}/${roleRequestID}`;
    return this.http.delete<ApiResponse<RoleResponse>>(url);
  }
}