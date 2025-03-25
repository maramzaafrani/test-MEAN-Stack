import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { RoleManagementComponent } from './pages/admin/role-management/role-management.component';

import { ArticlesComponent } from './pages/articles/articles.component';
import { CreateArticleComponent } from './pages/articles/create-article/create-article.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  
  { path: 'admin/roles', component: RoleManagementComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'articles/new', component: CreateArticleComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
