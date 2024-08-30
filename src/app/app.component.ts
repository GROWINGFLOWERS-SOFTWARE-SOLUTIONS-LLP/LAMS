import { Component } from '@angular/core';
import { HistoryComponent } from './Pages/Components/history/history.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HistoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LAMS';
}
