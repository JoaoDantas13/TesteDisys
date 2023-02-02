import { ApiService } from './service/api.service';
import { DialogComponent } from './dialog/dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';

//Angular Material
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Teste Disys';
  loading = false;
  displayedColumns: string[] = [
    'id',
    'nome',
    'sobrenome',
    'idade',
    'sexo',
    'acao',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private matSnackerBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getTodosUsuarios();
  }

  //Abrir a janela para cadastrar/editar
  abrirDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val == 'cadastrar') {
          this.getTodosUsuarios();
        }
      });
  }

  //Pegar os Usuarios
  getTodosUsuarios() {
    this.loading = true;
    this.api.getUsuarios().subscribe({
      next: (retorno) => {
        this.dataSource = new MatTableDataSource(retorno);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        alert('ERROR');
      },
    });
    this.loading = false;
  }

  //Dialog para EditarUsuario
  editUsuario(row: any) {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val == 'editar') [this.getTodosUsuarios()];
      });
  }

  //Deletar Usuario
  deleteUsuario(id: number) {
    this.api.deleteUsuario(id).subscribe({
      next: (retorno) => {
        this.matSnackerBar.open('Excluido com sucesso!', 'Fechar', {
          duration: 1500,
        });
        this.getTodosUsuarios();
      },
      error: () => {
        alert('Erro ao deletar o usuario');
      },
    });
  }

  //Filtro de Busca de Usuario
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
