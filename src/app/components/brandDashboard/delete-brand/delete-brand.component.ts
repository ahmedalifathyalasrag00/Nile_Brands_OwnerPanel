import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BrandService, User, Brand } from '../../../services/brand/brand.service';


@Component({
  selector: 'app-deletebrand',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delete-brand.component.html',
  styleUrls: ['./delete-brand.component.css']
})
export class DeleteBrandComponent implements OnInit {
  brandId!: string;
  loading = false;
  error: string | null = null;

  constructor(
    private brandService: BrandService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.brandService.getLoggedUser().subscribe({
      next: (user: User) => {
        this.brandService.getBrandsByOwner(user._id).subscribe({
          next: (brands: Brand[]) => {
            if (!brands.length) {
              this.error = 'No brand found.';
              return;
            }
            this.brandId = brands[0]._id;
          },
          error: () => this.error = 'Failed to load brand.'
        });
      },
      error: () => this.error = 'Failed to load user.'
    });
  }

  confirmDelete(): void {
    this.loading = true;
    this.brandService.deleteBrand(this.brandId).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/create-brand'], { replaceUrl: true });
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.message || 'Delete failed.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/hero'], { replaceUrl: true });
  }
}
