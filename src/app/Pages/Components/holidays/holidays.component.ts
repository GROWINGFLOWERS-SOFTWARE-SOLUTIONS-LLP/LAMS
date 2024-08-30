
import { Component, HostListener } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css'] // Fixed the styleUrl to styleUrls
})
export class HolidaysComponent {
  isMobile: boolean = false;

  // Define the start and end date of the year
  private startDate: Date = new Date('2024-01-01');
  private endDate: Date = new Date('2030-12-31');
  private weeklyOffDays: number[] = [0, 6]; // 0 for Sunday, 6 for Saturday

  constructor() {
    this.updateLayout();
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    weekends: true,
    events: this.getEvents(),
    customButtons: {
      custom2: {
        text: 'today',
        click: () => {
          alert('clicked custom button 2!');
        }
      }
    },
    windowResize: () => {
      // Optional: add any additional logic you need on window resize
    }
  };

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateLayout();
  }

  private updateLayout() {
    const width = window.innerWidth;
    this.isMobile = width <= 480;

    if (this.isMobile) {
      // Adjust calendar options for mobile
      this.calendarOptions.headerToolbar = {
        start: 'dayGridMonth',
        center: 'title',
        end: 'today prev,next'
      };
    } else {
      // Revert to default settings for larger screens
      this.calendarOptions.headerToolbar = {
        start: 'dayGridMonth,timeGridWeek,timeGridDay',
        center: 'title',
        end: 'today prevYear,prev,next,nextYear'
      };
    }
  }

  private getEvents() {
    // Fixed events
    const fixedEvents = [
      { color:'#3cb371', title: 'Republic Day', start: "2024-01-26" },
      { color:'#3cb371', title: 'Chhatrapati Shivaji Maharaj Jayanti', start: "2024-02-19" },
      { color:'#3cb371', title: 'Mahashivratri', start: "2024-03-08" },
      { color:'#3cb371', title: 'Holi (Second Day)', start: "2024-03-25" },
      { color:'#3cb371', title: 'Good Friday', start: "2024-03-29" },
      { color:'#3cb371', title: 'Gudhi Padwa', start: "2024-04-09" },
      { color:'#3cb371', title: 'Ramzan-Id (Id-UL-Fitr)', start: "2024-04-11" },
      { color:'#3cb371', title: 'Dr.Babasaheb Ambedkar Jayanti', start: "2024-04-14" },
      { color:'#3cb371', title: 'Ram Navami', start: "2024-04-17" },
      { color:'#3cb371', title: 'Maharashtra Din', start: "2024-05-01" },
      { color:'#3cb371', title: 'Buddha Pournima', start: "2024-05-23" },
      { color:'#3cb371', title: 'Bakri Id (Id-Uz-Zuha)', start: "2024-06-17" },
      { color:'#3cb371', title: 'Moharum', start: "2024-07-17" },
      { color:'#3cb371', title: 'Independence Day / Parsi New Year (Shahenshahi)', start: "2024-08-15" },
      { color:'#3cb371', title: 'Ganesh Chaturthi', start: "2024-09-07" },
      { color:'#3cb371', title: 'Id-E-Milad', start: "2024-09-16" },
      { color:'#3cb371', title: 'Mahatma Gandhi Jayanti', start: "2024-10-02" },
      { color:'#3cb371', title: 'Dasara', start: "2024-10-12" },
      { color:'#3cb371', title: 'Diwali Amavasaya (Laxmi Pujan)', start: "2024-11-01" },
      { color:'#3cb371', title: 'Diwali (Bali Pratipada)', start: "2024-11-02" },
      { color:'#3cb371', title: 'Guru Nanak Jayanti', start: "2024-11-15" },
      { color:'#3cb371', title: 'Christmas', start: "2024-12-25" },

      // Add other fixed events here
    ];

    // Generate weekly off events
    const weeklyOffEvents = this.getWeeklyOffEvents();

    return [...fixedEvents, ...weeklyOffEvents];
  }

  private getWeeklyOffEvents() {
    const events = [];
    let currentDate = new Date(this.startDate);

    while (currentDate <= this.endDate) {
      if (this.weeklyOffDays.includes(currentDate.getDay())) {
        events.push({
          title: 'Weekly Off',
          start: this.formatDate(currentDate),
          color: '#FFCCCB'
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return events;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


}
