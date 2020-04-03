import { Injectable } from '@angular/core';
import { Socket } from './utils/socket';
import { ConnectionData } from '@planning-poker/api-interfaces';

@Injectable( {
    providedIn: 'root'
} )
export class AppService {
    private clientDetails: any;

    constructor( private socket: Socket ) { }

    getDetails () {
        console.log( 'getDetails' );
        return this.socket
            .fromEvent( "myDetails" );
    }

    setMyDetails ( details ) {
        this.clientDetails = details;
    }

    getMyDetails () {
        return this.clientDetails;
    }

    getData () {
        console.log( 'getData' );
        return this.socket.fromEvent( 'data' );
    }

    createRoom ( payload: ConnectionData ) {
        console.log( 'createRoom', payload );
        this.socket.emit( 'createRoom', payload );
    }

    joinRoom ( payload: ConnectionData ) {
        console.log( 'joinRoom', payload );
        this.socket.emit( 'joinRoom', payload );
    }

    castVote ( payload: any ) {
        console.log( 'castVote', payload );
        this.socket.emit( 'vote', payload );
    }

    clearVotes ( room ) {
        console.log( 'clearVotes' );
        this.socket.emit( 'clearVotes', { room: room } );
    }

    showVotes ( room ) {
        console.log( 'showVotes' );
        this.socket.emit( 'showVotes', { room: room } );
    }


    requestUsers ( room ) {
        this.socket.emit( 'users', room );
    }
    getUsers () {
        return this.socket
            .fromEvent( "users" );
    }


    getFighters () {
        return this.socket
            .fromEvent( "fighters" );
    }
}
