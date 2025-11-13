package com.astra.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String apiKey;

    public void enviarEmail(String para, String assunto, String mensagem) {
        try {
            URL url = new URL("https://api.resend.com/emails");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer " + apiKey);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            String json = String.format(
                    "{\"from\":\"Astra App <no-reply@seudominio.com>\"," +
                            "\"to\":[\"%s\"]," +
                            "\"subject\":\"%s\"," +
                            "\"html\":\"<p>%s</p>\"}",
                    para, assunto, mensagem.replace("\"", "\\\"")
            );

            try (OutputStream os = conn.getOutputStream()) {
                os.write(json.getBytes(StandardCharsets.UTF_8));
            }

            int status = conn.getResponseCode();
            System.out.println("Status do envio: " + status);
            conn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
