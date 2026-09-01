import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Página inicial redireciona para login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rota de cadastro (qualquer pessoa pode acessar)
  {
    path: 'cadastro',
    loadComponent: () =>
      import('./pages/cadastro/cadastro.component').then(m => m.CadastroComponent)
  },

  // Rota de login (qualquer pessoa pode acessar)
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },

  // Rota de sorteio (SOMENTE quem está logado — protegida pelo authGuard)
  {
    path: 'sorteio',
    loadComponent: () =>
      import('./pages/sorteio/sorteio.component').then(m => m.SorteioComponent),
    canActivate: [authGuard]
  },

  // Qualquer rota inválida redireciona para login
  { path: '**', redirectTo: 'login' }
];