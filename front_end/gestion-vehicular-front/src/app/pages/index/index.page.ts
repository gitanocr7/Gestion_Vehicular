import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteNavComponent } from '../../shared/site-nav/site-nav.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SiteNavComponent
  ]
})
export class IndexPage implements OnInit {

  constructor() { }

  ngOnInit() { }

}