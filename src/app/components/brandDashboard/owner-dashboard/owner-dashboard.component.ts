import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserService, User } from '../../../services/user/user.service';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent   
  ],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css']
})
export class OwnerDashboardComponent implements OnInit {
  avatarUrl: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (user: User) => {
        this.avatarUrl = this.userService.getUserImageUrl(user.userImage);
      },
      error: () => {
        this.avatarUrl = 'images/ProfileImg.png';
      }
    });
  }
}
