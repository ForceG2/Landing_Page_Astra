import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { sendEmail } from '../service/emailService';

@Component({
  selector: 'app-forms',
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './forms.html',
  styleUrls: ['./forms.css']
})
export class Forms {
  formData = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefone: new FormControl('', Validators.required),
    dataNascimento: new FormControl('', [
      Validators.required,
      this.validarDataNascimento
    ]),
    termos: new FormControl(false, Validators.requiredTrue)
  });

toastVisible = false;

  async submitForm() {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }
    try {
      const response = await sendEmail(this.formData.value);
      console.log('Email enviado com sucesso:', response);
      this.showToast();

    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  }

  showToast() {
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 3000); 
  }

  validarDataNascimento(control: AbstractControl) {
    if (!control.value) return null;

    const data = new Date(control.value);
    const minData = new Date('1915-01-01');
    const maxData = new Date('2013-12-31');

    if (data < minData) return { minData: true };
    if (data > maxData) return { maxData: true };

    return null;
  }
}