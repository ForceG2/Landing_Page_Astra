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
        String email = body.get("email");
        emailService.enviarEmail(email, "Equipe Astra", "Sua inscrição foi confirmada com sucesso!");
        System.out.println("Email enviado com sucesso!");
        return "Email enviado!";
    }
}
