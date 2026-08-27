package br.com.projetosorteio.backend.service;

import br.com.projetosorteio.backend.entity.Sessao;
import br.com.projetosorteio.backend.repository.SessaoRepository;
import org.springframework.stereotype.Service;

@Service
public class SessaoService {

    private final SessaoRepository sessaoRepository;

    public SessaoService(SessaoRepository sessaoRepository) {
        this.sessaoRepository = sessaoRepository;
    }

    public Sessao criar(Sessao sessao) {

        if (sessao.getNumeroMinimo() >= sessao.getNumeroMaximo()) {
            throw new RuntimeException(
                    "O número mínimo deve ser menor que o número máximo"
            );
        }

        return sessaoRepository.save(sessao);
    }
}