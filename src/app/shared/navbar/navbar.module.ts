import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarRoutingModule } from './navbar-routing.module';
import { WsService } from 'src/app/services/ws/ws.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NavbarRoutingModule,
  ]
})
export class NavbarModule { }
