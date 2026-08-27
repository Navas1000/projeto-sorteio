import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SorteioService } from '../../services/sorteio.service';

@Component({
  selector: 'app-sorteio',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sorteio.component.html',
  styles: []
})
export class SorteioComponent {

  // Campos do formulário "Criar Sessão"
  numeroMinimo = 1;
  numeroMaximo = 10;

  // Estado da sessão ativa
  sessaoAtiva: any = null;        // Dados da sessão retornados pelo backend
  ultimoSorteado: number | null = null;  // Último número sorteado (destacado)
  sorteios: any[] = [];           // Lista de todos os sorteios desta sessão

  // Mensagens para o usuário
  mensagem = '';
  erro = '';

  constructor(
    private sorteioService: SorteioService,
    private authService: AuthService
  ) {}

  /** Cria uma nova sessão no backend com o intervalo [min, max] */
  criarSessao() {
    this.erro = '';
    this.mensagem = '';

    this.sorteioService.criarSessao(this.numeroMinimo, this.numeroMaximo).subscribe({
      next: (sessao) => {
        this.sessaoAtiva = sessao;  // Armazena os dados retornados
        this.sorteios = [];
        this.ultimoSorteado = null;
        this.mensagem = 'Sessão criada!';
      },
      error: (err) => {
        this.erro = err.error?.mensagem || 'Erro ao criar sessão';
      }
    });
  }

  /** Pede ao backend para sortear um número aleatório não repetido */
  sortear() {
    if (!this.sessaoAtiva) return;
    this.erro = '';
    this.mensagem = '';

    this.sorteioService.sortear(this.sessaoAtiva.idSessao).subscribe({
      next: (sorteio) => {
        this.ultimoSorteado = sorteio.numeroSorteado;
        this.sorteios.push(sorteio);
        this.sessaoAtiva.totalSorteados = this.sorteios.length;
      },
      error: (err) => {
        this.erro = err.error?.mensagem || 'Erro ao sortear';
      }
    });
  }

  /** Apaga todos os sorteios da sessão (reset) */
  resetar() {
    if (!this.sessaoAtiva) return;
    this.erro = '';

    this.sorteioService.resetar(this.sessaoAtiva.idSessao).subscribe({
      next: () => {
        this.sorteios = [];
        this.ultimoSorteado = null;
        this.sessaoAtiva.totalSorteados = 0;
        this.mensagem = 'Sessão resetada!';
      },
      error: (err) => {
        this.erro = err.error?.mensagem || 'Erro ao resetar';
      }
    });
  }

  /** Volta para a tela de "Criar Sessão" */
  novaSessao() {
    this.sessaoAtiva = null;
    this.sorteios = [];
    this.ultimoSorteado = null;
    this.mensagem = '';
    this.erro = '';
  }

  /** Faz logout e redireciona para /login */
  logout() {
    this.authService.logout();
  }
}