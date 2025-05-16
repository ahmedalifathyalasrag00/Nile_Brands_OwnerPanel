import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { OwnerDashboardComponent } from './components/brandDashboard/owner-dashboard/owner-dashboard.component';
import { HeroComponent } from './components/brandDashboard/hero/hero.component';
import { SignupComponent } from './components/signup/signup.component';
import { VerifyEmailComponent } from './components/verifyemail/verifyemail.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { CreatebrandComponent } from './components/createbrand/createbrand.component';
export const routes: Routes = [
    { path: 'signin', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'verify-email', component: VerifyEmailComponent },
    { path: 'forget-password', component: ForgetPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'create-brand', component: CreatebrandComponent },
    {
        path: 'dashboard',
        component: OwnerDashboardComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'hero', component: HeroComponent },
            { path: '', redirectTo: 'hero', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'dashboard/hero', pathMatch: 'full' }
];
