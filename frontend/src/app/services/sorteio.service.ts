import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SorteioService {

  private apiUrl = '/api/sessoes';

  constructor(private http: HttpClient) {}

  /** POST /api/sessoes — Cria uma nova sessão de sorteio com intervalo [min, max] */
  criarSessao(min: number, max: number): Observable<any> {
    return this.http.post(this.apiUrl, { numeroMinimo: min, numeroMaximo: max });
  }

  /** GET /api/sessoes/{id} — Busca detalhes de uma sessão */
  getSessao(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /** POST /api/sessoes/{id}/sortear — Sorteia um número aleatório não repetido */
  sortear(idSessao: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idSessao}/sortear`, {});
  }

  /** GET /api/sessoes/{id}/sorteios — Lista todos os números já sorteados */
  getSorteios(idSessao: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idSessao}/sorteios`);
  }

  /** DELETE /api/sessoes/{id}/sorteios — Apaga os sorteios (reset da sessão) */
  resetar(idSessao: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idSessao}/sorteios`);
  }
}