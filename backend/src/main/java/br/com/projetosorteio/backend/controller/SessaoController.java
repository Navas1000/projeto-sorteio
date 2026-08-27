package br.com.projetosorteio.backend.controller;

import br.com.projetosorteio.backend.entity.Sessao;
import br.com.projetosorteio.backend.service.SessaoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sessoes")
public class SessaoController {

    private final SessaoService sessaoService;

    public SessaoController(SessaoService sessaoService) {
        this.sessaoService = sessaoService;
    }

    @PostMapping
    public Sessao criar(@RequestBody Sessao sessao) {
        return sessaoService.criar(sessao);
    }
}