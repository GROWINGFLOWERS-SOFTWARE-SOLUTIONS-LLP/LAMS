import { Component, HostListener, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Holiday } from '../../../Core/Interfaces/holiday';
import { CommonModule } from "@angular/common";
import { EmployeeService } from '../../../Core/Services/Employee/employee.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [FullCalendarModule, CommonModule,CardModule],
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
   
    const weeklyOffEvents = this.getWeeklyOffEvents();

    return [...this.fixedEvents, ...weeklyOffEvents];
  }


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
  
//  cards = [
//   {
//     image: 'https://i.pinimg.com/736x/a5/07/68/a50768eeb89b624264c1db5503b5ee30.jpg',
//     title: 'Independence Day',
//     description: '15 Aug 2025'
//   },
//   {
//     image: 'https://static.toiimg.com/thumb/imgsize-23456,msid-86058743,width-600,resizemode-4/86058743.jpg',
//     title: 'Ganesh Chaturthi',
//     description: '27 Aug 2025'
//   },
//   {
//     image: 'data:image/jpeg;base64,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',
//     title: 'Gandhi Jayanti',
//     description: '02 Oct 2025'
//   },
//   {
//     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNuJORpo9j9Artkz8qhlLbWb291aIw7WoMKw&s',
//     title: 'Diwali',
//     description: '20 Oct 2025'
//   },
//   {
//     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR15O9M_nFlmpIzAx-zgyR_-4_gub_VersVzw&s',
//     title: 'Lakshmi Puja',
//     description: '21 OCt 2025'
//   },
//   {
//     image: 'https://img.freepik.com/free-vector/happy-dussehra-indian-traditional-vijayadashami-festival-background_1055-22008.jpg?semt=ais_hybrid&w=740',
//     title: 'Vijayadashmi',
//     description: '02 Oct 2025'
//   },
//   {
//     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWUC7Rrt2GfDX4H_NAjFoQNTL9Joa-60K2mA&s',
//     title: 'Bhaidooj',
//     description: '20 Oct 2025'
//   },
//   {
//     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAi97ydiNCad87LsC13azxxbYYmExt6ja2VA&s',
//     title: 'Christmas',
//     description: '21 OCt 2025'
//   }
// ];

}
