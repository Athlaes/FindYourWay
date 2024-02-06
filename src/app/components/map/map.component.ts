import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ MatButton, MatInput, MatFormField, MatLabel, LeafletModule ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  public options : Leaflet.MapOptions = {
    layers: this.getLayers(),
    zoom: 12,
    center: new Leaflet.LatLng(43.530147, 16.488932),
  }

  getLayers() : Leaflet.Layer[] {
    return [
      new Leaflet.TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      } as Leaflet.TileLayerOptions)
    ] as Leaflet.Layer[];
  }

  getMarkers(): Leaflet.Marker[] {
    return [
      new Leaflet.Marker(new Leaflet.LatLng(43.5121264, 16.4700729), {
        icon: new Leaflet.Icon({
          iconSize: [50, 41],
          iconAnchor: [13, 41],
          iconUrl: 'assets/blue-marker.svg',
        }),
        title: 'Workspace'
      } as Leaflet.MarkerOptions),
      new Leaflet.Marker(new Leaflet.LatLng(43.5074826, 16.4390046), {
        icon: new Leaflet.Icon({
          iconSize: [50, 41],
          iconAnchor: [13, 41],
          iconUrl: 'assets/red-marker.svg',
        }),
        title: 'Riva'
      } as Leaflet.MarkerOptions),
    ] as Leaflet.Marker[];
  };

  getRoutes() : Leaflet.Polyline[] {
    return [
      new Leaflet.Polyline([
        new Leaflet.LatLng(43.5121264, 16.4700729),
        new Leaflet.LatLng(43.5074826, 16.4390046),
      ] as Leaflet.LatLng[], {
        color: '#0d9148'
      } as Leaflet.PolylineOptions)
    ] as Leaflet.Polyline[];
  };
}
