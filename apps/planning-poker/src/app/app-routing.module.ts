import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomComponent } from './room/room.component';
import { JoinComponent } from './join/join.component';
const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: JoinComponent
    },
    {
        path: 'room',
        component: RoomComponent
    }
];

@NgModule( {
    imports: [ RouterModule.forRoot( routes ) ],
    exports: [ RouterModule ]
} )
export class AppRoutingModule { }
