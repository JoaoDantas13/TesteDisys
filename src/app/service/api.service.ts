import { Usuario } from './../interface/Usuario';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly API = 'https://api-laser-teste.herokuapp.com/alunos';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  //Cadastrar o usuario na Api
  postUsuario(dados: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.API, dados).pipe(
      map((retorno) => retorno),
      catchError((erro) => this.exibeErro(erro))
    );
  }

  //Pegar Usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API).pipe(
      map((retorno) => retorno),
      catchError((erro) => this.exibeErro(erro))
    );
  }

  //Editar Usuario
  putUsuario(data: any, id: number) {
    return this.http.put<Usuario>(`${this.API}/${id}`, data);
  }

  //Deletar Usuario
  deleteUsuario(id: number) {
    return this.http.delete<Usuario>(`${this.API}/${id}`);
  }

  //ExibirErro
  exibeErro(e: any): Observable<any> {
    this.exibirMensagem(
      'Erro!!',
      'Não foi possivel realizar a operação',
      'toast-error'
    );
    return EMPTY;
  }

  //ExibirMensagens
  exibirMensagem(titulo: string, mensagem: string, tipo: string) {
    this.toastr.show(
      mensagem,
      titulo,
      { closeButton: true, progressBar: true },
      tipo
    );
  }
}
