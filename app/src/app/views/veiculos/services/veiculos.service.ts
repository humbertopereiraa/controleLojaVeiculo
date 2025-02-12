import { Injectable } from '@angular/core'
import { Veiculos } from '../models/veiculos.model'
import { HttpClient } from '@angular/common/http'
import { map, Observable, of, tap } from 'rxjs'

const API_URL = 'api/veiculos' // Simulado pelo InMemoryWebApi

@Injectable({
  providedIn: 'root'
})
export class VeiculosService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Veiculos[]> {
    return this.http.get<Veiculos[]>(API_URL)
  }

  getById(id: number): Observable<Veiculos> {
    return this.getAll().pipe(
      map((veiculos: any) => {
        return veiculos.find((item: any) => item.id === id)
      }),
      tap(veiculo => {
        return of(veiculo)
      })
    )
  }

  post(veiculo: Veiculos): Observable<Veiculos> {
    return this.http.post<Veiculos>(API_URL, veiculo)
  }

  update(id: number, veiculo: Veiculos): Observable<Veiculos> {
    return this.http.put<Veiculos>(`${API_URL}/${id}`, veiculo)
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`)
  }
}
