import { Component, OnInit } from '@angular/core';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ClarityModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
