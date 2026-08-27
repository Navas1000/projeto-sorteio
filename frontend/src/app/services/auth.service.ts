import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // URL RELATIVA: funciona porque o NGINX faz proxy de /api/* para o backend
  // Em produção: Browser → NGINX (:80) → proxy_pass → Spring Boot (:8080)
  // Em dev local: ng serve usa proxy.conf.json para encaminhar /api/* para localhost:8080
  private apiUrl = '/api/auth';

  private loggedIn = false;

  constructor(private http: HttpClient, private router: Router) {
    // Ao recarregar a página, verifica se o usuário já estava logado
    this.loggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  /** Envia email e senha para criar uma nova conta no backend */
  cadastrar(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cadastro`, { email, senha });
  }

  /** Envia email e senha para fazer login. O backend retorna um cookie de sessão. */
  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, senha }).pipe(
      tap(() => {
        // tap() executa após o login ter sucesso (sem alterar a resposta)
        this.loggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
      })
    );
  }

  /** Faz logout: avisa o backend e limpa o estado local */
  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
    this.loggedIn = false;
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

  /** Retorna se o usuário está logado (usado pelo auth guard) */
  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}