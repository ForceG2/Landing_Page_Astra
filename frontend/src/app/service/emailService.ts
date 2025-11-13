const url = "https://astra-5hp1.onrender.com/email/";

export function sendEmail(formData: any) {
  return fetch(`${url}enviar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  }).then(res => res.text());
}
