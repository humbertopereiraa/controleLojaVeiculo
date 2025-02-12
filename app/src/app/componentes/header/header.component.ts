import { Component, OnInit } from '@angular/core'
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-header',
  standalone: true, // Define o componente como standalone
  imports: [ClarityModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
