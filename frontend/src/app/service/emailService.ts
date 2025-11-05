const url = "http://localhost:8080/email/";

export function sendEmail(formData: any) {
  return fetch(`${url}enviar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  }).then(res => res.text());
}
