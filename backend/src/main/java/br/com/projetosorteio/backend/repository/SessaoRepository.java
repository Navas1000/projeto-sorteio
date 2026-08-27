package br.com.projetosorteio.backend.repository;

import br.com.projetosorteio.backend.entity.Sessao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessaoRepository extends JpaRepository<Sessao, Long> {
}