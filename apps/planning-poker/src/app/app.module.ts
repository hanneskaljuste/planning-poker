import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoConfig, SocketIoModule } from './utils/socket';
import { AppRoutingModule } from './app-routing.module';
import { RoomComponent } from './room/room.component';
import { JoinComponent } from './join/join.component';
import { APP_BASE_HREF } from '@angular/common';

const config: SocketIoConfig = { url: 'http://localhost:3333/planning-poker', options: { pingTimeout: 90000, pingInterval: 1000 } };


@NgModule( {
    declarations: [ AppComponent, RoomComponent, JoinComponent ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        SocketIoModule.forRoot( config )
    ],
    providers: [

    ],
    bootstrap: [ AppComponent ]
} )
export class AppModule { }
