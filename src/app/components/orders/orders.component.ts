import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OrdersService, OwnerOrdersResponse } from '../../services/orders/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule   
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  pastOrders: any[] = [];
  loading = true;
  loadingMore = false;
  errorMsg = '';
  page = 1;
  pagination = { next: false };

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.loading = this.page === 1;
    this.ordersService.getOwnerOrders(this.page).subscribe({
      next: (res: OwnerOrdersResponse) => {
        this.pastOrders.push(...res.data);
        const returnedCount = res.data.length;
        this.pagination.next = (this.page * returnedCount) < res.length;

        this.loading = false;
        this.loadingMore = false;
      },
      error: err => {
        this.errorMsg = err?.error?.message || 'Error fetching orders';
        this.loading = false;
        this.loadingMore = false;
      }
    });
  }

  loadMore(): void {
    if (this.pagination.next && !this.loadingMore) {
      this.loadingMore = true;
      this.page++;
      this.getOrders();
    }
  }

  viewTracking(orderId: string): void {
    console.log('Tracking order:', orderId);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
