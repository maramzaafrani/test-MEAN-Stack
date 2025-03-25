import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  inscrit = false;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router
  ) {}

  // Détection de connexion
  isLoggedIn(): boolean {
    return !!this.auth.getToken();
  }

  // Déconnexion
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }



 

  onInscriptionReussie() {
    this.inscrit = true;
  }

  testAcces() {
    this.userService.getPrivate().subscribe({
      next: (res) => console.log(' Accès privé autorisé :', res),
      error: (err) => console.error(' Erreur d’accès privé', err)
    });
  }
}
