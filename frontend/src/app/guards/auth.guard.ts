import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard funcional que verifica se o usuário está logado.
 * Se não estiver, redireciona automaticamente para /login.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;  // Permite acesso
  }

  // Redireciona para login
  return router.createUrlTree(['/login']);
};