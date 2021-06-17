import { UserEntity } from './Models/user-entity.model';
import { UserService } from './Services/user.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'jwtimplementation';
  user: UserEntity;
  constructor(private userService: UserService) {
    this.userService.user.subscribe(x => this.user = x);
}
  logout() {
    var refreshtoken = localStorage.getItem("refreshtoken");
    this.userService.revoketoken(refreshtoken);
  }
}
