import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { ProfileAdminComponent } from './pages/profil.admin/profile-admin.component';
import { ProfileUserComponent } from './pages/profil.user/profile-user.component';
import {AuthGuard} from "./config/guards/auth.guard";
import {AdminGuard} from "./config/guards/admin.guard";




export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'profile-admin', component: ProfileAdminComponent, canActivate: [AdminGuard] },
  { path: 'profile-user', component: ProfileUserComponent, canActivate: [AuthGuard] },
];
