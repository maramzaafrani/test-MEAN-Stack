import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { AppComment } from '../../models/app-comment.model';
import { SocketServiceTsService } from '../../services/socket.service.ts.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html'
})
export class ArticlesComponent implements OnInit, OnDestroy {
  articles: any[] = [];
  selectedArticle: any = null;
  newArticle: any = { titre: '', contenu: '' };
  message: string = '';

  commentaires: AppComment[] = [];
  selectedArticleId: string = '';
  commentingArticleId: string = ''; // pour savoir quel article est "déplié"
  reponses: { [key: string]: string } = {};

  constructor(
    private articleService: ArticleService,
    private socketService: SocketServiceTsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadArticles();

    this.socketService.listen('new-comment', (data: AppComment) => {
      if (data.article === this.commentingArticleId) {
        this.commentaires.push(data);
        this.commentaires = this.structureComments(this.commentaires);
      }
    });
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadArticles() {
    this.articleService.getAllArticles().subscribe({
      next: (res) => (this.articles = res),
      error: () => (this.message = 'Erreur de chargement des articles')
    });
  }

  createArticle() {
    this.articleService.createArticle(this.newArticle).subscribe({
      next: () => {
        this.loadArticles();
        this.newArticle = { titre: '', contenu: '' };
        this.message = 'Article créé avec succès';
      },
      error: () => (this.message = "Erreur lors de la création de l'article")
    });
  }

  selectArticle(article: any) {
    this.selectedArticle = { ...article };
    this.selectedArticleId = article._id;
  }

  updateArticle() {
    if (!this.selectedArticle) return;

    this.articleService.updateArticle(this.selectedArticle._id, this.selectedArticle).subscribe({
      next: () => {
        this.loadArticles();
        this.selectedArticle = null;
        this.message = 'Article mis à jour avec succès';
      },
      error: () => (this.message = "Erreur lors de la mise à jour de l'article")
    });
  }

  deleteArticle(articleId: string) {
    this.articleService.deleteArticle(articleId).subscribe({
      next: () => {
        this.loadArticles();
        this.message = 'Article supprimé avec succès';
      },
      error: () => (this.message = "Erreur lors de la suppression de l'article")
    });
  }

  toggleCommentSection(articleId: string) {
    if (this.commentingArticleId === articleId) {
      this.commentingArticleId = '';
      this.commentaires = [];
    } else {
      this.commentingArticleId = articleId;
      this.loadComments(articleId);
    }
  }

  loadComments(articleId: string) {
    this.articleService.getComments(articleId).subscribe({
      next: (res) => {
        this.commentaires = this.structureComments(res);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des commentaires:', err);
        this.message = "Erreur lors du chargement des commentaires";
      }
    });
  }

  envoyerCommentaire(parentId: string | null = null, articleId: string = this.commentingArticleId) {
    const key = parentId ? parentId : 'root-' + articleId;
    const contenu = this.reponses[key];

    if (!contenu || contenu.trim() === '') return;

    const data = {
      articleId,
      contenu,
      parentId
    };

    this.articleService.postComment(data).subscribe({
      next: () => {
        this.reponses[key] = '';
        this.loadComments(articleId); // recharge les commentaires après ajout
      },
      error: (err) => {
        console.error("Erreur lors de l'envoi du commentaire :", err);
        this.message = "Erreur lors de l'envoi du commentaire";
      }
    });
  }

  structureComments(comments: AppComment[]): AppComment[] {
    const map = new Map<string, AppComment>();
    const roots: AppComment[] = [];

    for (const c of comments) {
      c.children = [];
      map.set(c._id!, c);
    }

    for (const c of comments) {
      if (c.parent) {
        const parent = map.get(c.parent);
        parent?.children?.push(c);
      } else {
        roots.push(c);
      }
    }

    return roots;
  }
}
