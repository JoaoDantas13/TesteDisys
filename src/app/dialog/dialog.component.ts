import { ApiService } from './../service/api.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  formulario!: FormGroup;
  teste: any;
  acaoBotao: string = 'Cadastrar';
  loading = false;
  constructor(
    private FormBuilder: FormBuilder,
    private api: ApiService,
    private matSnackerBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.formulario = this.FormBuilder.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      idade: ['', Validators.required],
      sexo: ['', Validators.required],
    });

    if (this.editData) {
      this.acaoBotao = 'Editar';
      this.formulario.controls['nome'].setValue(this.editData.nome);
      this.formulario.controls['sobrenome'].setValue(this.editData.sobrenome);
      this.formulario.controls['idade'].setValue(this.editData.idade);
      this.formulario.controls['sexo'].setValue(this.editData.sexo);
    }
  }

  //Função para cadastrar o Usuario
  cadastrarUsuario() {
    this.loading = true;
    if (!this.editData) {
      if (this.formulario.valid) {
        this.api.postUsuario(this.formulario.value).subscribe({
          next: (res) => {
            this.matSnackerBar.open('Cadastrado com sucesso!', 'Fechar', {
              duration: 1500,
            });
            this.formulario.reset();
            this.dialogRef.close();
          },
          error: () => {
            this.matSnackerBar.open(
              'Erro , por favor tente novamente mais tarde!'
            );
          },
        });
      }
    } else {
      this.editarUsuario();
    }
    this.loading = false;
  }

  //Função para Editar o Usuario
  editarUsuario() {
    this.api.putUsuario(this.formulario.value, this.editData.id).subscribe({
      next: (retorno) => {
        this.matSnackerBar.open('Alterado com sucesso!', 'Fechar', {
          duration: 1500,
        });
        this.formulario.reset();
        this.dialogRef.close('editar');
      },
      error: () => {
        this.matSnackerBar.open('Erro , por favor tente novamente mais tarde!');
      },
    });
  }
}
