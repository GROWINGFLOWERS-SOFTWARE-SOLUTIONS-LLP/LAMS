import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ApiService } from '../../../Core/Services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [TabViewModule],
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.css'
})
export class RolesListComponent {

}