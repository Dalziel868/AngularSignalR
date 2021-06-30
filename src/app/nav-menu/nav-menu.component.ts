import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { ModalService } from '../modal/modal.service';
import { NotificationCountResult, NotificationResult } from '../notification/notification';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  notification?:NotificationCountResult;
  messages!:Array<NotificationResult>;
  errorMessage ='';
  isExpanded=false;
  constructor(private notifiService:NotificationService,private modalService:ModalService) { }

  getNotificationCount()
  {
    this.notifiService.getNotificationCount().subscribe(
      (data)=>this.notification=data,
      (err:any)=>this.errorMessage=<any>err
    )
  }

  getNotificationMessage()
  {
    
    this.notifiService.getNotificationMessage()
    .subscribe(m=>this.messages=m,
      err=>this.errorMessage=<any>err);
  }
  ngOnInit(): void {
    this.getNotificationCount();
    const connect=new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl(environment.baseUrl+'notify')
    .build();

    connect.start().then(()=>console.log('SignalR Connected!'))
    .catch((err)=>console.error(err.toString()));

    connect.on('BroadCastMessage',()=>this.getNotificationCount());
  }
  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
  deleteNotifications():void
  {
    if(confirm('Are you sure want to delete all notifications?'))
    {
      this.notifiService.deleteNotifications().subscribe(()=>this.closeModal(),(err:any)=>this.errorMessage=<any>err);
    }
  }
  openModal() {
    this.getNotificationMessage();
    this.modalService.open('custom-modal');
  }

  closeModal() {
    this.modalService.close('custom-modal');
  }
}
