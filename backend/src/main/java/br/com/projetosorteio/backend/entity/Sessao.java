package br.com.projetosorteio.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "sessao")
public class Sessao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sessao")
    private Long idSessao;

    @Column(name = "id_usuario", nullable = false)
    private Long idUsuario;

    @Column(name = "numero_minimo", nullable = false)
    private Integer numeroMinimo;

    @Column(name = "numero_maximo", nullable = false)
    private Integer numeroMaximo;

    public Sessao() {
    }

    public Long getIdSessao() {
        return idSessao;
    }

    public void setIdSessao(Long idSessao) {
        this.idSessao = idSessao;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Integer getNumeroMinimo() {
        return numeroMinimo;
    }

    public void setNumeroMinimo(Integer numeroMinimo) {
        this.numeroMinimo = numeroMinimo;
    }

    public Integer getNumeroMaximo() {
        return numeroMaximo;
    }

    public void setNumeroMaximo(Integer numeroMaximo) {
        this.numeroMaximo = numeroMaximo;
    }
}