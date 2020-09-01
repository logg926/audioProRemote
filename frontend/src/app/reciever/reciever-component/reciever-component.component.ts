import { Component, OnInit } from '@angular/core';

import { RecievingService } from '../recieving.service';
@Component({
  selector: 'app-reciever-component',
  templateUrl: './reciever-component.component.html',
  styleUrls: ['./reciever-component.component.css'],
})
export class RecieverComponent implements OnInit {
  constructor(private recievingService: RecievingService) {}

  ngOnInit(): void {}
}
