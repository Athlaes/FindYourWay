import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    MatButton,
    MatInput,
    MatFormField,
    MatLabel,
    LeafletModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [HttpClient],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit {
  private geocodingUrl = 'http://api-adresse.data.gouv.fr/search?q=';
  private map!: L.Map;
  private routingControl!: L.Routing.Control;

  public from = '';
  public to = '';
  public center = this.getLocalisation();
  public layers: L.Layer[] = [
    new L.TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }),
  ];
  public options: L.MapOptions = {
    layers: this.layers,
    zoom: 12,
    center: this.center,
  };

  constructor(
    private httpClient: HttpClient,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.map = L.map('leafmap', {
      layers: this.layers,
      zoom: 12,
      center: this.center,
    });
  }

  getLocalisation(): L.LatLng {
    let x = 48.688135;
    let y = 6.171586;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        x = pos.coords.latitude;
        y = pos.coords.longitude;
      });
    }
    return new L.LatLng(x, y);
  }

  getLayers(): L.Layer[] {
    return [
      new L.TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      } as L.TileLayerOptions),
    ] as L.Layer[];
  }

  getMarker(lat: any, long: any, name: string): L.Marker {
    return new L.Marker(new L.LatLng(lat, long), {
      icon: new L.Icon({
        iconSize: [50, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/location-dot-solid.svg',
      }),
      title: name,
    } as L.MarkerOptions);
  }

  getRoute(latFrom: any, longFrom: any, latTo: any, longTo: any): L.Polyline {
    return new L.Polyline(
      [new L.LatLng(latFrom, longFrom), new L.LatLng(latTo, longTo)],
      {
        color: '#0d9148',
      }
    );
  }

  searchPoints(): any {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }
    if (this.from && this.to) {
      this.httpClient
        .request('GET', this.geocodingUrl + this.from)
        .subscribe((res: any) => {
          this.httpClient
            .request('GET', this.geocodingUrl + this.to)
            .subscribe((result: any) => {
              if (res?.features && result?.features) {
                let latFrom = res?.features[0]?.geometry.coordinates[1];
                let longFrom = res?.features[0]?.geometry.coordinates[0];
                let latTo = result?.features[0]?.geometry.coordinates[1];
                let longTo = result?.features[0]?.geometry.coordinates[0];
                this.addRoutesToMap(latFrom, longFrom, latTo, longTo);
              }
            });
        });
    }
  }

  addRoutesToMap(latFrom: number, longFrom: number, latTo: number, longTo: number) {
    let waypoints = [
      new L.LatLng(latFrom, longFrom),
      new L.LatLng(latTo, longTo),
    ];
    this.routingControl = L.Routing.control({
      waypoints,
      show: false,
      waypointMode: 'snap',
      fitSelectedRoutes: true,
      plan: L.Routing.plan(waypoints, {
        createMarker: (i, wp) => {
          return L.marker(wp.latLng, {
            draggable: true,
            icon: new L.Icon({
              iconSize: [50, 41],
              iconAnchor: [13, 41],
              iconUrl: 'assets/location-dot-solid.svg',
            }),

          });
        },
      }),
    });
    this.routingControl.addTo(this.map)
  }
}
