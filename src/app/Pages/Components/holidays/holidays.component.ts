import { Component, HostListener, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Holiday } from '../../../Core/Interfaces/holiday';
import { CommonModule } from "@angular/common";
import { EmployeeService } from '../../../Core/Services/Employee/employee.service';


@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [FullCalendarModule, CommonModule],
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css'] // Fixed the styleUrl to styleUrls
})
export class HolidaysComponent implements OnInit {
  isMobile: boolean = false;
  fixedEvents: any[] = [];
  isLoading: boolean = true; // Added loader flag
  loadingTime: number = 2; 

  private startDate: Date = new Date('2024-01-01');
  private endDate: Date = new Date('2030-12-31');
  private weeklyOffDays: number[] = [0, 6]; // 0 for Sunday, 6 for Saturday

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getAllHolidaysListWithDelay();
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    weekends: true,
    events: async () => await this.getEvents(),
    customButtons: {
      custom2: {
        text: 'today',
        click: () => {
          alert('clicked custom button 2!');
        }
      }
    },
    windowResize: () => {
      this.updateLayout();
    }
  };

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateLayout();
  }

  updateLayout() {
    const width = window.innerWidth;
    this.isMobile = width <= 600;

    if (this.isMobile) {
      this.calendarOptions.headerToolbar = {
        start: 'dayGridMonth',
        center: 'title',
        end: 'today prev,next'
      };
    } else {
      this.calendarOptions.headerToolbar = {
        start: 'dayGridMonth,timeGridWeek,timeGridDay',
        center: 'title',
        end: 'today prevYear,prev,next,nextYear'
      };
    }
  }

  async getEvents(): Promise<any[]> {
    // Wait for the holidays list to be fetched
    // await this.loadFixedEvents();

    // Generate weekly off events
    const weeklyOffEvents = this.getWeeklyOffEvents();

    return [...this.fixedEvents, ...weeklyOffEvents];
  }

  // async loadFixedEvents(): Promise<void> {
  //   // Fetch the holidays list and assign to fixedEvents
  //   const holidays: Holiday[] = await this.employeeService.getAllHolidays().toPromise();
  //   this.fixedEvents = holidays.map(holiday => ({
  //     title: holiday.holidayName,
  //     start: holiday.holidayDate,
  //     color: '#90EE90' // You can adjust the color as needed
  //   }));
  // }

  getWeeklyOffEvents() {
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

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Add 3-second delay before fetching data
  getAllHolidaysListWithDelay() {
    this.isLoading = true; // Show loader
      this.employeeService.getAllHolidays().subscribe((holidays: Holiday) => {
        this.fixedEvents = holidays?.data.map((holiday:any) => ({
          title: holiday.holidayName,
          start: holiday.holidayDate,
          color: '#90EE90' // You can adjust the color as needed
        }));
        this.updateLayout();
        this.isLoading = false; // Hide loader after loading holidays
      });

  }
}
