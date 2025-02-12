import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs'

const API_URL = 'api/timeline' // Simulado pelo InMemoryWebApi

@Injectable({
  providedIn: 'root'
})
export class TimelineVeiculosService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(API_URL)
  }

  getByIdVeiculo(id: number): Observable<any[]> {
    return this.getAll().pipe(
      map(timeline => {
        return timeline.filter(item => item.veiculo_id === id)
      })
    )
  }

  post(timeline: any): Observable<any[]> {
    timeline['id'] = Math.floor(1000 + Math.random() * 9000)
    return this.http.post<any>(API_URL, timeline)
  }


  deleteByVeiculoOuTarefa(id: number, tipo: 'veiculo' | 'tarefa'): Observable<void> {
    const param = tipo === 'veiculo' ? 'veiculo_id' : 'tarefa_id';
    return this.http.delete<void>(`${API_URL}/?${param}=${id}`);
  }  
}
