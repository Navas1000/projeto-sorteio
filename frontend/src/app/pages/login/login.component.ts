import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.erro = '';

    this.authService.login(this.email, this.senha).subscribe({
      next: () => {
        // Login OK → navega para a tela de sorteio
        this.router.navigate(['/sorteio']);
      },
      error: (err) => {
        this.erro = err.error?.mensagem || 'Email ou senha inválidos';
      }
    });
  }
}