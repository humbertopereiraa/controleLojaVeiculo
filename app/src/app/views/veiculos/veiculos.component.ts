import { Component, OnInit } from '@angular/core'
import { VeiculosService } from './services/veiculos.service'
import { Veiculos } from './models/veiculos.model'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { DatagridComponent } from '../../shared/datagrid/datagrid.component'
import { lastValueFrom } from 'rxjs'
import { TimelineVeiculosService } from '../../shared/timeline/services/timelineVeiculos.service'
import { TimelineComponent } from '../../shared/timeline/timeline.component'
import { EditorVeiculoComponent } from './componentes/editor-veiculo/editor-veiculo.component'
import { TarefaVeiculoComponent } from './componentes/tarefa-veiculo/tarefa-veiculo.component'
import { NotificationService } from '../../core/notification.service'

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.component.html',
  styleUrls: ['./veiculos.component.scss'],
  imports: [FormsModule, CommonModule, DatagridComponent, TimelineComponent, EditorVeiculoComponent, TarefaVeiculoComponent]
})
export class VeiculosComponent implements OnInit {

  public veiculos: Veiculos[] = []
  public columns: { key: string, header: string, tipo: 'string' | 'booleano' | 'number', cores?: any }[] = [
    { key: 'placa', header: 'Placa', tipo: 'string' },
    { key: 'renavam', header: 'Renavam', tipo: 'string' },
    { key: 'modelo', header: 'Modelo', tipo: 'string' },
    { key: 'marca', header: 'Marca', tipo: 'string' },
    { key: 'ano', header: 'Ano', tipo: 'string' },
    { key: 'motor', header: 'Motor', tipo: 'string' },
    { key: 'vistoriaEntrada', header: 'Vistoria Entrada', tipo: 'booleano' },
    { key: 'vistoriaSaida', header: 'Vistoria Saída', tipo: 'booleano' },
    {
      key: 'situacao', header: 'Situação', tipo: 'string', cores: {
        'Estoque/ComDoc': '#4caf50', // Verde
        'Estoque/SemDoc': '#ff9800', // Laranja
        'Pré-Venda': '#2196f3', // Azul
        'Venda/ComDoc': '#8bc34a', // Verde claro
        'Venda/SemDoc': '#f44336', // Vermelho
      }
    },
    { key: 'descricao', header: 'Descrição', tipo: 'string' }
  ]
  public isPopupOpen = false
  public isPopupTarefa = false
  public veiculoSelecionado: any = null
  public veiculoID: number = null as any

  constructor(private veiculosService: VeiculosService, private timelineVeiculosService: TimelineVeiculosService, private notificationService: NotificationService) { }

  async ngOnInit(): Promise<void> {
    this.veiculos = await lastValueFrom(this.veiculosService.getAll())
  }

  abrirPopupEdicao(veiculo?: any) {
    this.veiculoSelecionado = veiculo ?? undefined
    this.isPopupOpen = true
  }

  async salvarVeiculo(dados: { veiculo: Veiculos, acao: 'Add' | 'Edit' }) {
    const { veiculo, acao } = dados
    acao === 'Add' ? await this.inserirVeiculo(veiculo) : await this.editarVeiculo(veiculo)
    this.isPopupOpen = false;
  }

  async onDelete(veiculo: Veiculos) {
    this.deletarVeiculo(veiculo.id)
  }

  public onTarefa(veiculoID: number): void {
    this.veiculoID = veiculoID
    this.isPopupTarefa = true
  }

  private async inserirVeiculo(veiculo: Veiculos): Promise<void> {//TODO: add data cadastro veículo
    try {
      const newVeiculo = await lastValueFrom(this.veiculosService.post(veiculo))
      this.veiculos.unshift(newVeiculo)
      this.notificationService.success('Veiculo inserido com sucesso!')

      const timelineEvento = {
        veiculo_id: newVeiculo.id,
        descricao: newVeiculo.situacao,
        tarefa_id: null,
        data: new Date().toISOString(),
      };

      await lastValueFrom(this.timelineVeiculosService.post(timelineEvento));
    } catch (error) {
      this.notificationService.error('Error ao inserir veiculo!')
      console.error(`Error ao inserir veiculo: ${JSON.stringify(error)}`)
    }
  }

  private async editarVeiculo(veiculo: Veiculos): Promise<void> {
    try {
      await lastValueFrom(this.veiculosService.update(veiculo.id, veiculo))
      const index = this.veiculos.findIndex(v => v.id === veiculo.id)
      if (index !== -1) {
        if (this.veiculos[index]?.situacao !== veiculo.situacao) {
          const timelineEvento = {
            veiculo_id: veiculo.id,
            descricao: veiculo.situacao,
            tarefa_id: null,
            data: new Date().toISOString(),
          };
          await lastValueFrom(this.timelineVeiculosService.post(timelineEvento));
        }
        const novoArray = [...this.veiculos] // Mantém a imutabilidade
        novoArray[index] = veiculo
        this.veiculos = novoArray
      }
      this.notificationService.success('Veiculo editado com sucesso!')
    } catch (error) {
      this.notificationService.error('Error ao editar veiculo!')
      console.error(`Error ao editar veiculo: ${JSON.stringify(error)}`)
    }
  }

  private async deletarVeiculo(id: number): Promise<void> {
    try {
      await lastValueFrom(this.veiculosService.delete(id))
      await lastValueFrom(this.timelineVeiculosService.deleteByVeiculoOuTarefa(id, 'veiculo'));
      this.veiculos = this.veiculos.filter((i) => i.id !== id)
      this.notificationService.success('Veiculo deletado com sucesso!')
    } catch (error) {
      this.notificationService.error('Error ao deletar veiculo!')
      console.error(`Error ao deletar veiculo: ${JSON.stringify(error)}`)
    }
  }
}
