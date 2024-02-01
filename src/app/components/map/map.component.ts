import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ MatButton, MatInput, MatFormField, MatLabel ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {

}
