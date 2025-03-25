import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { AppComment } from '../models/app-comment.model';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private apiUrl = 'http://localhost:3000/articles';

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Récupération
  getAllArticles(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getArticleById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Création
  createArticle(data: any): Observable<any> {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(this.apiUrl, data, { headers });
  }

  // Mise à jour
  updateArticle(id: string, data: any): Observable<any> {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers });
  }

  // Suppression
  deleteArticle(id: string): Observable<any> {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

// src/app/services/article.service.ts
getComments(articleId: string): Observable<AppComment[]> {
  return this.http.get<AppComment[]>(`http://localhost:3000/comments/${articleId}`);
}


postComment(comment: any): Observable<any> {
  const token = this.auth.getToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.post(`http://localhost:3000/comments`, comment, { headers });
}
}