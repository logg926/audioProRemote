import { Component, OnInit } from '@angular/core';

import { RecievingService } from '../services/recieving.service';
@Component({
  selector: 'app-reciever-component',
  templateUrl: './reciever-component.component.html',
  styleUrls: ['./reciever-component.component.css'],
})
export class RecieverComponentComponent implements OnInit {
  constructor(private recievingService: RecievingService) {}

  ngOnInit(): void {}
}
