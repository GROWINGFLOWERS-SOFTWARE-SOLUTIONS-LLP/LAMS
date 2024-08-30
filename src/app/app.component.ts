import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HolidaysComponent } from './Pages/Components/holidays/holidays.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HolidaysComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LAMS';
}
