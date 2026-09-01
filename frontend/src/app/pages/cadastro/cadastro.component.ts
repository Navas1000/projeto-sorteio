import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, RouterLink],  // FormsModule permite usar [(ngModel)]
  templateUrl: './cadastro.component.html',
  styles: []
})
export class CadastroComponent {
  email = '';
  senha = '';
  mensagem = '';
  erro = '';

  constructor(private authService: AuthService, private router: Router) {}

  cadastrar() {
    this.erro = '';
    this.mensagem = '';

    this.authService.cadastrar(this.email, this.senha).subscribe({
      // Callback de sucesso
      next: () => {
        this.mensagem = 'Conta criada com sucesso! Redirecionando para login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      // Callback de erro
      error: (err) => {
        this.erro = err.error?.mensagem || 'Erro ao criar conta';
      }
    });
  }
}