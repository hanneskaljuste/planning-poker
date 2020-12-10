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
        pathMatch: 'full',
        component: RoomComponent
    },
    {
        path: 'room/:id',
        component: JoinComponent
    },
];

@NgModule( {
    imports: [ RouterModule.forRoot( routes ) ],
    exports: [ RouterModule ]
} )
export class AppRoutingModule { }
