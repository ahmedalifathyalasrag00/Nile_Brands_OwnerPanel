import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BrandService, User, Brand } from '../../../services/brand/brand.service';

@Component({
  selector: 'app-updatebrand',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './update-brand.component.html',
  styleUrls: ['./update-brand.component.css']
})
export class UpdatebrandComponent implements OnInit {
  form!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  loading = false;
  success = false;
  private brandId!: string;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      description: [''],
      logo: [null]
    });
    this.loading = true;
    this.brandService.getLoggedUser().subscribe({
      next: (user: User) => {
        this.brandService.getBrandsByOwner(user._id).subscribe({
          next: (brands: Brand[]) => {
            this.loading = false;
            if (!brands.length) return;
            const b = brands[0];
            this.brandId = b._id;
            this.form.patchValue({
              name: b.name,
              description: b.description
            });
            this.previewUrl = this.brandService.getLogoUrl(b.logo);
          },
          error: () => { this.loading = false; }
        });
      },
      error: () => { this.loading = false; }
    });
  }

  onFileChange(evt: Event): void {
    const file = (evt.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) return;
    this.form.patchValue({ logo: file });
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result);
    reader.readAsDataURL(file);
  }

  submit(): void {
    this.loading = true;
    const fd = new FormData();
    const v = this.form.value;
    if (v.name) fd.append('name', v.name);
    if (v.description) fd.append('description', v.description);
    if (v.logo) fd.append('logo', v.logo as File);

    this.brandService.updateBrand(this.brandId, fd).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.router.navigate(['/dashboard/hero'], { replaceUrl: true }), 1500);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}