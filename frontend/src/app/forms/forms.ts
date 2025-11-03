import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { sendEmail } from '../service/emailService';

@Component({
  selector: 'app-forms',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forms.html',
  styleUrls: ['./forms.css'],
})
export class Forms {
  formData = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(11),
      Validators.minLength(11),
    ]),
    dataNascimento: new FormControl('', [Validators.required, this.validarDataNascimento]),
    termos: new FormControl(false, Validators.requiredTrue),
  });

  toastVisible = false;

  carregando: boolean = false;

  async submitForm() {
    if (this.formData.invalid || this.carregando) {
      this.formData.markAllAsTouched();
      return;
    }

    this.carregando = true;
    const tempoMinimo = new Promise((res) => setTimeout(res, 1000));

    try {
      const resposta = await Promise.all([sendEmail(this.formData.value), tempoMinimo]);

      console.log('Email enviado com sucesso:', resposta[0]);
      this.showToast();
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    } finally {
      this.carregando = false;
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
    const minData = new Date('1925-01-01');
    const maxData = new Date('2013-12-31');

    if (data < minData) return { minData: true };
    if (data > maxData) return { maxData: true };

    return null;
  }

  phoneFormat(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 11) input = input.substring(0, 11);
    let formatted = input;
    if (input.length > 6) {
      formatted = `(${input.substring(0, 2)}) ${input.substring(2, 7)}-${input.substring(7)}`;
    } else if (input.length > 2) {
      formatted = `(${input.substring(0, 2)}) ${input.substring(2)}`;
    } else if (input.length > 0) {
      formatted = `(${input}`;
    }

    event.target.value = formatted;
    this.formData.get('telefone')?.setValue(input, { emitEvent: false });
  }
}
