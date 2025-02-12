import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    // Simulação de autenticação sem backend
    if (email === 'admin@gmail.com' && password === 'admin@!') {
      localStorage.setItem('isLoggedIn', 'true'); // Salvar no localStorage
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn'); // Remover do localStorage
    this.router.navigate(['/login']); // Redirecionar para a tela de login
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
