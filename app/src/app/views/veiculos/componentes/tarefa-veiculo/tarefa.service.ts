import { Injectable } from '@angular/core'
import { lastValueFrom, Observable, of } from 'rxjs'
import { Tarefa } from './tarefa.model'
import AWN from "awesome-notifications"
import { VeiculosService } from '../../services/veiculos.service'

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private tarefas: Tarefa[] = []

  constructor(private veiculosService: VeiculosService) {
    this.iniciarCronJob(); // Inicia a verificação periódica das tarefas
  }

  getTarefasPorVeiculo(veiculo_id: number): Observable<Tarefa[]> {
    return of(this.tarefas.filter(t => t.veiculo_id === veiculo_id))
  }

  adicionarTarefa(tarefa: Omit<Tarefa, 'id'>): Observable<Tarefa> {
    const novaTarefa = { id: Math.floor(1000 + Math.random() * 9000), ...tarefa }; // Gerando um ID aleatório
    this.tarefas.push(novaTarefa);
    return of(novaTarefa);
  }

  editarTarefa(tarefa: Tarefa): Observable<Tarefa> {
    const index = this.tarefas.findIndex(t => t.id === tarefa.id);
    if (index !== -1) this.tarefas[index] = tarefa;
    return of(tarefa);
  }

  deletarTarefa(id: number): Observable<boolean> {
    this.tarefas = this.tarefas.filter(t => t.id !== id);
    return of(true);
  }

  concluirTarefa(id: number): Observable<Tarefa | null> {
    const tarefa = this.tarefas.find(t => t.id === id);
    if (tarefa) {
      tarefa.status_tarefa = 'CONCLUIDA';
      return of(tarefa);
    }
    return of(null);
  }

  private iniciarCronJob() {
    setInterval(() => {
      const agora = new Date().getTime()
      this.tarefas.forEach(async tarefa => {
        const prazo = new Date(tarefa.data_prazo).getTime();
        const diferencaMs = prazo - agora;

        // Se a tarefa já foi concluída, ignora
        if (tarefa.status_tarefa === 'CONCLUIDA') return;

        const veiculo = await lastValueFrom(this.veiculosService.getById(tarefa.veiculo_id))

        const notifier = new AWN({
          labels: {
            info: `Veículo da Placa: ${veiculo.placa}`,
            warning: `Veículo da Placa: ${veiculo.placa}`,
          },
          durations: {
            info: 60000,
            warning: 60000
          }
        })

        let unidadeTempo: string = ''
        let tempo: number = null as any

        if (diferencaMs <= 0) {
          notifier.warning(`A tarefa "${tarefa.nome}" está atrasada!`)
          return
        }

        const diferencaMin = Math.floor(diferencaMs / (1000 * 60))
        if (diferencaMin >= 1440) {
          tempo = Math.floor(diferencaMin / 1440)
          unidadeTempo = 'dias'
        } else if (diferencaMin >= 60) {
          tempo = Math.floor(diferencaMin / 60)
          unidadeTempo = 'horas'
        } else {
          unidadeTempo = 'minutos'
        }
        notifier.info(`"${tarefa.nome}" <br> <b>Faltam ${ tempo ?? diferencaMs} ${unidadeTempo}`)
      })
    }, 60000 * 3) // Verifica a cada 3 minutos
  }
}
