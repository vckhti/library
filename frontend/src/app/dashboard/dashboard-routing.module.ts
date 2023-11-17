import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {AuthorsComponent} from "./components/authors/authors.component";
import {BooksComponent} from "./components/books/books.component";

const routes: Routes = [
  {
    path: '', component:
    DashboardComponent,
    canActivate: [
    ],
    children: [
      {path: '', redirectTo: '/authors', pathMatch: 'full'},
      {path: 'authors', component: AuthorsComponent},
      {path: 'books', component: BooksComponent},
      {path: '**', redirectTo: '/authors', pathMatch: 'full'},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
