import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotFoundComponent} from "./core/components/not-found/not-found.component";
import {AuthorsComponent} from "./dashboard/components/authors/authors.component";

const routes: Routes = [
  { path: '',
    loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule),
  },
  {
    path: '**',
    loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule),
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
