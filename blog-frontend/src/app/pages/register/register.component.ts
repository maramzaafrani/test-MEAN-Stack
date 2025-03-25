import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  nom = '';
  email = '';
  motdepasse = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.auth.register({ nom: this.nom, email: this.email, motdepasse: this.motdepasse }).subscribe({
      next: () => {
        alert('Inscription réussie !');
        this.router.navigate(['/login']);
      },
      error: (err) => alert('Erreur : ' + err.error.message)
    });
  }
}