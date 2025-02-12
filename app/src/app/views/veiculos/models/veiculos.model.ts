export interface Veiculos {
  id: number
  placa: string
  renavam: string
  modelo: string
  marca: string
  ano: number
  motor: string
  quilometragem: number
  vistoriaEntrada: boolean
  vistoriaSaida: boolean
  situacao: string // Estoque/SemDoc, Estoque/ComDoc, Pré-Venda, Venda/SemDoc, Venda/ComDoc,
  descricao: string
  dataCadastro: Date
}
