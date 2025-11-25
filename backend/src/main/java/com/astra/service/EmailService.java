package com.astra.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String apiKey;

    public void enviarEmail(String para, String assunto, String mensagemHtml) {
        try {
            URL url = new URL("https://api.resend.com/emails");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer " + apiKey);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            ObjectMapper mapper = new ObjectMapper();

            Map<String, Object> jsonMap = new HashMap<>();
            jsonMap.put("from", "onboarding@resend.dev");
            jsonMap.put("to", new String[]{para});
            jsonMap.put("subject", assunto);
            jsonMap.put("html", mensagemHtml);

            String json = mapper.writeValueAsString(jsonMap);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(json.getBytes(StandardCharsets.UTF_8));
            }

            int status = conn.getResponseCode();
            System.out.println("Status do envio: " + status);

            InputStream responseStream =
                    (status >= 200 && status < 300)
                            ? conn.getInputStream()
                            : conn.getErrorStream();

            String response = new String(responseStream.readAllBytes(), StandardCharsets.UTF_8);
            System.out.println("Resposta Resend: " + response);

            conn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
