import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { ArticleService } from '../../../services/article.service';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html'
})
export class CreateArticleComponent {
  titre = '';
  contenu = '';
  imageUrl = '';
  tags = '';

  constructor(private articleService: ArticleService, private router: Router) {}

  create() {
    const payload = {
      titre: this.titre,
      contenu: this.contenu,
      imageUrl: this.imageUrl,
      tags: this.tags.split(',').map(t => t.trim())
    };

    this.articleService.createArticle(payload).subscribe({
      next: (res) => {
        alert('Article créé !');
        this.router.navigate(['/articles']);
      },
      error: (err) => alert('Erreur : ' + err.message)
    });
  }
}
