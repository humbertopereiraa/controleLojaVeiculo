import { CommonModule } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { TimelineVeiculosService } from './services/timelineVeiculos.service'
import { NotificationService } from '../../core/notification.service'

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TimelineComponent implements OnInit {

  @Input() veiculoID!: number
  @Input() etapas: { data: string, descricao: string }[] = []

  public timelines: any = []

  constructor(private timelineVeiculosService: TimelineVeiculosService, private notificationService: NotificationService) { }

  ngOnInit() { }

  ngOnChanges(changes: any) {
    if (changes?.veiculoID?.currentValue) {
      this.carregarTimeline()
    }
  }

  private carregarTimeline(): void {
    this.timelineVeiculosService.getByIdVeiculo(this.veiculoID).subscribe({
      next: (timeline: any[]) => {
        this.timelines = timeline
      },
      error: (err) => {
        console.error(err)
        this.notificationService.error('Erro ao carregar timeline!')
      },
    })
  }


}
