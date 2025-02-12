import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  private showNotification(message: string, type: 'primary' | 'success' | 'danger' | 'warning', iconClass: string = '') {
    const alert = document.createElement('div')
    alert.className = `alert w-50 text-left alert-${type} fixed-bottom mx-auto d-flex align-items-center`
    alert.innerHTML = `<div class="me-2"> <i class="${iconClass}"></i> </div> <div> ${message} </div>`
    document.body.appendChild(alert)
    setTimeout(() => alert.remove(), 4000)
  }

  public info(mensagem: string): void {
    this.showNotification(mensagem, 'primary', 'fa-solid fa-circle-info')
  }

  public success(mensagem: string): void {
    this.showNotification(mensagem, 'success', 'fa-solid fa-circle-check')
  }

  public error(mensagem: string): void {
    this.showNotification(mensagem, 'danger', 'fa-solid fa-circle-xmark')
  }

  public warning(mensagem: string): void {
    this.showNotification(mensagem, 'warning', 'fa-solid fa-circle-exclamation')
  }

}