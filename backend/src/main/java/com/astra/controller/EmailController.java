package com.astra.controller;

import com.astra.service.EmailService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/email")
public class EmailController {
    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/enviar")
    public String enviar(@RequestBody Map<String, String> body) {
        String nome = body.get("nome");
        String email = body.get("email");
        String telefone = body.get("telefone");
        String dataNascimento = body.get("dataNascimento");
        String termos = String.valueOf(body.get("termos"));

        String mensagem = String.format(
                """
                <h2>Confirmação de Inscrição</h2>
                <p><strong>Nome:</strong> %s</p>
                <p><strong>Email:</strong> %s</p>
                <p><strong>Telefone:</strong> %s</p>
                <p><strong>Data de Nascimento:</strong> %s</p>
                <p><strong>Aceitou os Termos:</strong> %s</p>
                <br/>
                <p>Sua inscrição foi registrada com sucesso!</p>
                """,
                nome, email, telefone, dataNascimento, termos
        );
        emailService.enviarEmail("spaceastra0@gmail.com", "Equipe Astra", mensagem);
        return "Email enviado!";
    }
}
