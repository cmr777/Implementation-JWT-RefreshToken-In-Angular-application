import { UserEntity } from './../Models/user-entity.model';
import { UserService } from './../Services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userList: UserEntity[];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserList().pipe().subscribe(users => {

      this.userList = users;
  });
  }

}
