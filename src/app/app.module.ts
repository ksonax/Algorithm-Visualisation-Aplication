import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisualiserComponent } from './components/visualiser/visualiser.component';
import { SortNavBarComponent } from './components/sort-nav-bar/sort-nav-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PathfindingComponent } from './components/pathfinding/pathfinding.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { PathfindingNavBarComponent } from './components/pathfinding-nav-bar/pathfinding-nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const appRoutes: Routes = [
  {path: '', component: PathfindingComponent},
  {path: 'visualiser', component: VisualiserComponent},
  {path: 'pathfinding', component: PathfindingComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    VisualiserComponent,
    SortNavBarComponent,
    HeaderComponent,
    FooterComponent,
    PathfindingComponent,
    PathfindingNavBarComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
