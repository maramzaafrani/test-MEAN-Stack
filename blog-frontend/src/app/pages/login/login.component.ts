import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
nom: any;
register() {
throw new Error('Method not implemented.');
}
  email = '';
  motdepasse = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login({ email: this.email, motdepasse: this.motdepasse }).subscribe({
      next: (res) => {
        this.auth.saveToken(res.accessToken);
        alert('Connexion réussie !');
        this.router.navigate(['/articles']);
      },
      error: () => alert('Erreur de connexion')
    });
  }
}
