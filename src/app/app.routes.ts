import { Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "map", component: MapComponent}
];
