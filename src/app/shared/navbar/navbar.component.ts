import { Component, OnInit } from '@angular/core';
// import { ChatService } from 'src/app/services/chat/chat.service';
import { WsService } from 'src/app/services/ws/ws.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'; 

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  newMessage: string = '';
  messageList: string[] = [];

  constructor(
    // private chatService: ChatService,
    private webSocketService: WsService
    ) {  }

  ngOnInit(): void {
    // this.webSocketService.getNewMessage().subscribe((message: string) => {
    //   this.messageList.push(message);
    //   console.log(this.messageList)
    // })
    
  }

  // sendMessage() {
  //   this.webSocketService.sendMessage(this.newMessage);
  //   this.newMessage = '';
  // }
}
