export interface Tarefa {
  id: number
  veiculo_id: number
  nome: string
  data_criacao: string
  data_prazo: string
  status_tarefa: string // 'PENDENTE' | 'CONCLUIDA'
  notificado: boolean
}
