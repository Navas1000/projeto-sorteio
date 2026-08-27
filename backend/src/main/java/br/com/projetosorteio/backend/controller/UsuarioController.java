package br.com.projetosorteio.backend.controller;

import br.com.projetosorteio.backend.entity.Usuario;
import br.com.projetosorteio.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public Usuario cadastrar(@RequestBody Usuario usuario) {
        return usuarioService.cadastrar(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Usuario usuario) {

        return usuarioService.buscarPorEmail(usuario.getEmail())
                .filter(u -> u.getSenha().equals(usuario.getSenha()))
                .map(u -> ResponseEntity.ok("Login realizado com sucesso"))
                .orElse(ResponseEntity.status(401).body("E-mail ou senha incorretos"));
    }
}