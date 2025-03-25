import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  getPrivate() {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get('http://localhost:3000/private', { headers });
  }

  getRole() {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<{ role: string }>('http://localhost:3000/private', { headers });
  }

  updateRole(userId: string, role: string) {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.patch('http://localhost:3000/admin/update-role', { userId, role }, { headers });
  }
  
}