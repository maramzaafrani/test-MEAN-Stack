import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html'
})
export class RoleManagementComponent {
  userId = '';
  role = '';
  message = '';

  constructor(private userService: UserService) {}

  updateRole() {
    this.userService.updateRole(this.userId, this.role).subscribe({
      next: (res: any) => this.message = res.message,
      error: (err) => this.message = err.error?.message || 'Erreur'
    });
  }
}