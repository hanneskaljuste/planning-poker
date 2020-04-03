import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../app.service';

@Component( {
    selector: 'planning-poker-room',
    templateUrl: './room.component.html',
    styleUrls: [ './room.component.scss' ]
} )
export class RoomComponent implements OnInit {
    public user: any;
    public users: any[];
    public scales = [ 1, 2, 3, 5, 8, 13, 21 ];

    maxFighter = null;
    minFighter = null;

    lockVote = false;
    constructor(
        private service: AppService,
        private router: Router

    ) { }

    ngOnInit (): void {
        this.user = this.service.getMyDetails();

        this.service.getDetails().subscribe( d => {
            console.log( 'getDetails', d );
            this.user = d
        } );

        if ( !this.user ) {
            this.router.navigate( [ '' ] );
        } else {
            this.service.getUsers().subscribe( u => {
                this.users = u;
                console.log( 'users', u );
                if ( u.filter( usr => usr.vote ).length > 0 ) {
                    this.lockVote = true;
                } else {
                    this.lockVote = false;
                }
            } );
            this.service.requestUsers( this.user.room );
        }


        this.service.getFighters().subscribe( f => {
            console.log( 'fighters', f );
            this.maxFighter = f.maxFighter;
            this.minFighter = f.minFighter;
        } );

    }

    castVote ( scale: number ) {
        if ( !this.lockVote ) {
            this.service.castVote( { vote: scale, room: this.user.room } );
        }

    }

    showVotes () {
        if ( this.user.isAdmin ) {
            this.service.showVotes( this.user.room );
        }
    }
    clearVotes () {
        if ( this.user.isAdmin ) {
            this.service.clearVotes( this.user.room );
        }
    }


}
