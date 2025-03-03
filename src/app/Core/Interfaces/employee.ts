export interface Employee {
  id(id: any, currentMonth: number, currentYear: number): unknown;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  manager: string;
  email: string;
}
