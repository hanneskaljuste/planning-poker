import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@planning-poker/api-interfaces';
import { AppService } from './../app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component( {
    selector: 'planning-poker-join',
    templateUrl: './join.component.html',
    styleUrls: [ './join.component.scss' ]
} )
export class JoinComponent implements OnInit {
    form: FormGroup;
    constructor(
        private http: HttpClient,
        private service: AppService,
        private router: Router
    ) { }

    ngOnInit () {
        this.service.getDetails().subscribe(
            details => {
                if ( details ) {
                    this.service.setMyDetails( details );
                    this.router.navigate( [ 'room' ] );
                }
            }
        );

        this.form = new FormGroup( {
            name: new FormControl( '', Validators.required ),
            room: new FormControl( '' ),
        } );

    }


    sendMessage () {
        // this.service.sendMessage( 'testing' );
    }


    join ( f: FormGroup ) {
        if ( f.valid ) {
            if ( f.controls.room.value ) {
                this.service.joinRoom( f.value )
                // this.service.joinRoom( { name: form.controls.name.value, room: form.controls.room.value } );
            } else {
                this.service.createRoom( f.value );
            }

        }
    }

}
