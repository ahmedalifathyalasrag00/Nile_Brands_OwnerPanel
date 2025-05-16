import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../services/auth/auth.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements AfterViewInit {
  constructor(private authService: AuthService) { }

  logout(): void {
    this.authService.logout();
  }
  ngAfterViewInit() {
    initFlowbite(); // Initializes Flowbite dropdowns after view is ready
  }
}