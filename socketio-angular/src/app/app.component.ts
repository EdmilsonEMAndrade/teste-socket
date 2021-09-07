import { SocketioService } from './socketio.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';


// static data only for demo purposes, in real world scenario, this would be already stored on client
const JWT_SECRET = 'myRandomHash';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'socketio-angular';

  SENDER = {
    id: "01",
    name: "",
    room: ""
  };
  
  messages = [];

  tokenForm = this.formBuilder.group({
    token: '',
    name: '',
    room:''
  });

  messageForm = this.formBuilder.group({
    message: '',
  });

  constructor(private socketService: SocketioService, private formBuilder: FormBuilder) {}

  ngOnInit() {
  }

  async submitToken() {
    const token = this.tokenForm.get('token').value;
    this.SENDER.name=this.tokenForm.get('name').value;
    this.SENDER.room=this.tokenForm.get('room').value;
    if (token) {
      this.socketService.setupSocketConnection(token);
      this.socketService.joinRoom(this.SENDER.room);
      this.socketService.subscribeToMessages((err, data) => {
        console.log("NEW MESSAGE ", data);
        this.messages = [...this.messages, data];
      });
    }
  }

  submitMessage() {
    const message = this.messageForm.get('message').value;
    if (message) {
      this.socketService.sendMessage({message, roomName: this.SENDER.room}, cb => {        
      });
      this.messages = [
        ...this.messages,
        {
          message,
          ...this.SENDER,
        },
      ];      
      this.messageForm.reset();
    }
  }
  
  ngOnDestroy() {
    this.socketService.disconnect();
  }
}
