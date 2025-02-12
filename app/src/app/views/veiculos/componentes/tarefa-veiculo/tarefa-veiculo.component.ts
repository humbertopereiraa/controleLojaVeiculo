import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Tarefa } from './tarefa.model'
import { TarefaService } from './tarefa.service'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { NotificationService } from '../../../../core/notification.service'
import { TimelineVeiculosService } from '../../../../shared/timeline/services/timelineVeiculos.service'
import { lastValueFrom } from 'rxjs'

@Component({
  selector: 'app-tarefa-veiculo',
  templateUrl: './tarefa-veiculo.component.html',
  styleUrls: ['./tarefa-veiculo.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TarefaVeiculoComponent implements OnInit {

  @Input() veiculoID!: number
  @Input() isOpen: boolean = false
  @Output() close = new EventEmitter<void>()

  public form: FormGroup
  public tarefas: Tarefa[] = []
  public isForm: boolean = false
  public minDate: string = new Date().toISOString()
  public isOpenPopupConfimacao: boolean = false
  private tarefaSelecionada: Tarefa = null as any

  constructor(private tarefaService: TarefaService, private fb: FormBuilder, private notificationService: NotificationService, private timelineVeiculosService: TimelineVeiculosService) {
    this.form = this.criarFormulario()
  }

  ngOnInit(): void { }

  ngOnChanges(changes: any) {
    if (changes?.veiculoID?.currentValue) {
      this.carregarTarefas()
    }
  }

  carregarTarefas() {
    this.tarefaService.getTarefasPorVeiculo(this.veiculoID).subscribe(tarefas => this.tarefas = tarefas)
  }

  public onOpenPopupConfimacao(tarefa: Tarefa): void {
    this.tarefaSelecionada = tarefa
    this.isOpenPopupConfimacao = true
  }

  public exibirForm(): void {
    this.isForm = true
    this.form = this.criarFormulario()
  }

  public fecharPopup(): void {
    this.isForm = false
    this.close.emit()
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched() // Força a exibição dos erros
      return
    }

    const data_criacao = new Date().toISOString()
    const form = this.form.value
    const novaTarefa: Omit<Tarefa, 'id'> = {
      ...form,
      veiculo_id: this.veiculoID,
      data_criacao,
      status_tarefa: new Date(data_criacao).valueOf() > new Date(form.data_prazo).valueOf() ? 'ATRASADA' : 'PENDENTE',
      notificado: false
    }
    this.tarefaService.adicionarTarefa(novaTarefa).subscribe({
      next: async (tarefa) => {
        this.notificationService.success('Tarefa inserirda com sucesso!')
        this.carregarTarefas()
        const timelineEvento = {
          veiculo_id: this.veiculoID,
          descricao: tarefa.nome,
          tarefa_id: tarefa.id,
          data: new Date().toISOString(),
        };

        await lastValueFrom(this.timelineVeiculosService.post(timelineEvento));
        this.isForm = false
      },
      error: (e) => {
        this.notificationService.error('Erro ao inserir tarefa!')
        console.error(e)
      },
    })
  }

  public concluirTarefa(id: number) {
    this.tarefaService.concluirTarefa(id).subscribe({
      next: () => {
        this.notificationService.success('Tarefa concluída com sucesso!')
        this.carregarTarefas()
      },
      error: (e) => {
        this.notificationService.error('Erro ao concluir tarefa!')
        console.error(e)
      },
    })
  }

  public excluirTarefa() {
    if (typeof this.tarefaSelecionada?.id !== 'number') {
      this.notificationService.error('Erro ao excluir tarefa!')
      return
    }
    this.tarefaService.deletarTarefa(this.tarefaSelecionada.id).subscribe({
      next: async () => {
        await lastValueFrom(this.timelineVeiculosService.deleteByVeiculoOuTarefa(this.tarefaSelecionada.id, 'tarefa'));
        this.notificationService.success('Tarefa excluída com sucesso!')
        this.carregarTarefas()
      },
      error: (e) => {
        this.notificationService.error('Erro ao excluir tarefa!')
        console.error(e)
      },
      complete: () => this.isOpenPopupConfimacao = false
    })
  }

  private criarFormulario(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(240)]],
      data_prazo: ['', [Validators.required]],
    })
  }
}
