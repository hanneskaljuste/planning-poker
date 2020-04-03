import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@planning-poker/api-interfaces';
import { AppService } from './app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component( {
    selector: 'planning-poker-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
} )
export class AppComponent {

}
