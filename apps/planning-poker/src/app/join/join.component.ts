import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@planning-poker/api-interfaces';
import { AppService } from './../app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'planning-poker-join',
    templateUrl: './join.component.html',
    styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {
    form: FormGroup;
    constructor(
        private http: HttpClient,
        private service: AppService,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl('', Validators.required),
            room: new FormControl(''),
        });

        const name = localStorage.getItem('username');
        const room = this.route.snapshot.params.id;
        console.log(room, name)
        if (room) {
            this.form.patchValue({
                room: room
            })
            console.log('patched room')
        }
        if (name) {
            this.form.patchValue({
                name: name
            })
            console.log('patched name')
        }
        if (room && name) {
            this.join(this.form);
        }

        this.service.getDetails().subscribe(
            details => {
                if (details) {
                    this.service.setMyDetails(details);
                    this.router.navigate(['room']);
                }
            }
        );

    }


    sendMessage() {
        // this.service.sendMessage( 'testing' );
    }


    join(f: FormGroup) {
        if (f.valid) {
            localStorage.setItem('username', this.form.value.name);
            if (f.controls.room.value) {
                this.service.joinRoom(f.value)
                // this.service.joinRoom( { name: form.controls.name.value, room: form.controls.room.value } );
            } else {
                this.service.createRoom(f.value);
            }

        }
    }
}
