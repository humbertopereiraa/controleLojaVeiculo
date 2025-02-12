import { Injectable } from '@angular/core'
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api'


@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  private veiculos: any[] = [];
  private timeline: any[] = [];

  createDb() {
    this.veiculos = this.generateVeiculos();
    this.timeline = this.generateTimeline(this.veiculos);

    return { veiculos: this.veiculos, timeline: this.timeline };
  }

  private generateVeiculos() {
    return [
      {
        id: 1,
        placa: 'ABC-1234',
        renavam: '12345678901',
        modelo: 'Corolla',
        marca: 'Toyota',
        ano: 2020,
        motor: '2.0',
        vistoriaEntrada: true,
        vistoriaSaida: false,
        situacao: 'Estoque/SemDoc',
        descricao: 'Veículo em ótimo estado, aguardando documentação.',
        dataCadastro: new Date(2025, 0, 15).toISOString()
      },
      {
        id: 2,
        placa: 'DEF-5678',
        renavam: '23456789012',
        modelo: 'Civic',
        marca: 'Honda',
        ano: 2019,
        motor: '1.8',
        vistoriaEntrada: true,
        vistoriaSaida: false,
        situacao: 'Estoque/ComDoc',
        descricao: 'Revisado recentemente, pronto para venda.',
        dataCadastro: new Date(2025, 1, 10).toISOString()
      },
      {
        id: 3,
        placa: 'GHI-9101',
        renavam: '34567890123',
        modelo: 'Gol',
        marca: 'Volkswagen',
        ano: 2018,
        motor: '1.6',
        vistoriaEntrada: true,
        vistoriaSaida: false,
        situacao: 'Pré-Venda',
        descricao: 'Cliente interessado, aguardando negociação.',
        dataCadastro: new Date(2025, 2, 5).toISOString()
      },
      {
        id: 4,
        placa: 'JKL-1121',
        renavam: '45678901234',
        modelo: 'Onix',
        marca: 'Chevrolet',
        ano: 2021,
        motor: '1.0 Turbo',
        vistoriaEntrada: true,
        vistoriaSaida: false,
        situacao: 'Venda/SemDoc',
        descricao: 'Carro vendido, aguardando documentação.',
        dataCadastro: new Date(2025, 3, 20).toISOString()
      },
      {
        id: 5,
        placa: 'MNO-3141',
        renavam: '56789012345',
        modelo: 'Fiesta',
        marca: 'Ford',
        ano: 2017,
        motor: '1.5',
        vistoriaEntrada: true,
        vistoriaSaida: true,
        situacao: 'Venda/ComDoc',
        descricao: 'Venda concluída com documentação completa.',
        dataCadastro: new Date(2025, 4, 8).toISOString()
      },
      {
        id: 6,
        placa: 'PQR-5161',
        renavam: '67890123456',
        modelo: 'HB20',
        marca: 'Hyundai',
        ano: 2022,
        motor: '1.0 Turbo',
        vistoriaEntrada: true,
        vistoriaSaida: false,
        situacao: 'Estoque/SemDoc',
        descricao: 'Modelo novo, excelente custo-benefício.',
        dataCadastro: new Date(2025, 5, 12).toISOString()
      },
      {
        id: 7,
        placa: 'STU-7181',
        renavam: '78901234567',
        modelo: 'Cronos',
        marca: 'Fiat',
        ano: 2019,
        motor: '1.3',
        vistoriaEntrada: true,
        vistoriaSaida: false,
        situacao: 'Estoque/ComDoc',
        descricao: 'Carro espaçoso e confortável para a família.',
        dataCadastro: new Date(2025, 6, 25).toISOString()
      },
      {
        id: 8,
        placa: 'VWX-9202',
        renavam: '89012345678',
        modelo: 'Duster',
        marca: 'Renault',
        ano: 2016,
        motor: '2.0',
        vistoriaEntrada: true,
        vistoriaSaida: false,
        situacao: 'Pré-Venda',
        descricao: 'Veículo reservado, pagamento pendente.',
        dataCadastro: new Date(2025, 7, 17).toISOString()
      },
      {
        id: 9,
        placa: 'YZA-1023',
        renavam: '90123456789',
        modelo: 'Compass',
        marca: 'Jeep',
        ano: 2023,
        motor: '2.0 Turbo',
        vistoriaEntrada: true,
        vistoriaSaida: false,
        situacao: 'Venda/SemDoc',
        descricao: 'SUV vendido, aguardando finalização da papelada.',
        dataCadastro: new Date(2025, 8, 29).toISOString()
      },
      {
        id: 10,
        placa: 'BCD-2045',
        renavam: '01234567890',
        modelo: 'Kicks',
        marca: 'Nissan',
        ano: 2020,
        motor: '1.6',
        vistoriaEntrada: true,
        vistoriaSaida: true,
        situacao: 'Venda/ComDoc',
        descricao: 'Venda concluída, pronto para retirada.',
        dataCadastro: new Date(2025, 9, 3).toISOString()
      }
    ]
  }

  private generateTimeline(veiculos: any[]) {
    const eventos = [
      { tipo: 'Vistoria Entrada', dias: 2 },
      { tipo: 'Enviar Documento Despachante', dias: 7 },
      { tipo: 'Estoque/ComDoc', dias: 10 },
      { tipo: 'Pré-Venda', dias: 15 },
      { tipo: 'Vistoria Saída', dias: 20 },
      { tipo: 'Venda/SemDoc', dias: 25 },
      { tipo: 'Enviar Documento Despachante Saída', dias: 30 },
      { tipo: 'Pagamento de Taxa', dias: 35 },
      { tipo: 'Venda/ComDoc', dias: 40 }
    ];

    let timeline: any[] = [];

    veiculos.forEach(veiculo => {
      let dataBase = new Date(veiculo.dataCadastro);

      eventos.forEach((evento, index) => {
        let data_mudanca = new Date(dataBase);
        data_mudanca.setDate(dataBase.getDate() + evento.dias);

        timeline.push({
          id: timeline.length + 1,
          veiculo_id: veiculo.id,
          descricao: evento.tipo,
          status_id: index + 1, // Simulando IDs dos status
          tarefa_id: null, // Pode ser associado a uma tarefa específica se necessário
          data: data_mudanca.toISOString()
        });
      });
    });

    return timeline;
  }

  delete(reqInfo: RequestInfo) {
    const url = reqInfo.url;
    const veiculoIdMatch = url.match(/veiculo_id=(\d+)/);
    const tarefaIdMatch = url.match(/tarefa_id=(\d+)/);

    if (veiculoIdMatch) {
      const veiculoId = parseInt(veiculoIdMatch[1], 10);
      reqInfo.collection = reqInfo.collection.filter((t: any) => t.veiculo_id !== veiculoId);
      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: { message: `Todas as timelines do veículo ${veiculoId} foram excluídas.` },
      }));
    }

    if (tarefaIdMatch) {
      const tarefaId = parseInt(tarefaIdMatch[1], 10);
      reqInfo.collection = reqInfo.collection.filter((t: any) => t.tarefa_id !== tarefaId);
      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: { message: `Todas as timelines da tarefa ${tarefaId} foram excluídas.` },
      }));
    }

    return undefined;
  }
}
