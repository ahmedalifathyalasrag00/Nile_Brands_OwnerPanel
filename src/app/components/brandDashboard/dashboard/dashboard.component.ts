import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(...registerables, annotationPlugin);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('trendChartRef') trendChartRef!: ElementRef;
  @ViewChild('brandChartRef') brandChartRef!: ElementRef;

  dashboardData: any;
  trendsData: any;
  productsData: any;
  weeklySales = 0;
  weeklyChangePct = 0;
  isLoading = true;
  errorMessage: string | null = null;
  maxDailySales = 0;

  private trendChart: Chart | null = null;
  private brandChart: Chart | null = null;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.isLoading = true;
    this.errorMessage = null;
    this.destroyCharts();
    this.dashboardService.getDashboardData().subscribe({
      next: res => {
        this.dashboardData = res.data;
        if (!this.dashboardData.customerStats.oldCustomers) {
          this.dashboardData.customerStats.oldCustomers =
            (this.dashboardData.customerStats.totalCustomers || 0)
            - (this.dashboardData.customerStats.newCustomers || 0)
            - (this.dashboardData.customerStats.returningCustomers || 0);
        }
        this.maxDailySales = Math.max(...this.dashboardData.dailyStats.map((d: any) => d.sales));
        this.cdr.detectChanges();
      },
      error: err => this.handleError(err)
    });
    this.dashboardService.getTrendsData().subscribe({
      next: res => {
        this.trendsData = res.data;
        this.computeWeeklySales();
        this.cdr.detectChanges();
        this.createTrendChart();
      },
      error: err => this.handleError(err)
    });
    this.dashboardService.getProductsData().subscribe({
      next: res => {
        this.productsData = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: err => this.handleError(err)
    });
  }

  private computeWeeklySales() {
    const len = this.trendsData.length;
    const last7 = this.trendsData.slice(len - 7, len);
    const prev7 = this.trendsData.slice(len - 14, len - 7);
    this.weeklySales = last7.reduce((sum: number, d: any) => sum + d.sales, 0);
    const prevSum = prev7.reduce((sum: number, d: any) => sum + d.sales, 0);
    this.weeklyChangePct = prevSum ? Math.round(((this.weeklySales - prevSum) / prevSum) * 100) : 0;
  }

  private createTrendChart() {
    if (!this.trendChartRef?.nativeElement || !this.trendsData?.length) return;
    const dates = this.trendsData.map((i: any) =>
      new Date(i.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const sales = this.trendsData.map((i: any) => i.sales);
    const revenue = this.trendsData.map((i: any) => i.revenue);
    this.trendChart?.destroy();
    this.trendChart = new Chart(this.trendChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Sales Volume',
            data: sales,
            borderColor: '#033555',
            backgroundColor: this.createGradient('#033555', 0.1),
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#033555',
            fill: true
          },
          {
            label: 'Revenue ($)',
            data: revenue,
            borderColor: '#70CEAF',
            backgroundColor: this.createGradient('#70CEAF', 0.1),
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#70CEAF',
            fill: true
          }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }



  private createGradient(color: string, opacity: number) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return color;
    const grad = ctx.createLinearGradient(0, 0, 0, 400);
    grad.addColorStop(0, `${color}${Math.floor(opacity * 255).toString(16)}`);
    grad.addColorStop(1, `${color}00`);
    return grad;
  }

  private handleError(error: any) {
    this.isLoading = false;
    if (error.status === 401) {
      this.errorMessage = 'Session expired. Redirecting to login...';
      setTimeout(() => this.authService.logout(), 2000);
    } else {
      this.errorMessage = 'Failed to load data. Please try again later.';
    }
    this.cdr.detectChanges();
  }

  private destroyCharts() {
    this.trendChart?.destroy();
    this.brandChart?.destroy();
  }
}
