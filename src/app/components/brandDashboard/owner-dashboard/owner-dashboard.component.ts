import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  hideShell = false;

  // child routes under /dashboard where shell should be hidden
  private hiddenChildPaths = [
    '/dashboard/analytics-dashboard'
    , '/dashboard/orders'
  ];

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects.split('?')[0];
        this.hideShell = this.hiddenChildPaths.includes(url);
      });
  }

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (user: User) => {
        this.avatarUrl = this.userService.getUserImageUrl(user.userImage);
      },
      error: () => {
        this.avatarUrl = 'assets/images/ProfileImg.png';
      }
    });

    // initial hide check
    const initialUrl = this.router.url.split('?')[0];
    this.hideShell = this.hiddenChildPaths.includes(initialUrl);
  }
}
