import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { ConnectionData } from '@planning-poker/api-interfaces';
import { Room } from './models/room.model';
import { User } from './models/user.model';

@WebSocketGateway( {
    parh: '/api',
    namespace: '/planning-poker',
    pingTimeout: 60000,
    pingInterval: 5000,
} )
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    protected logger: Logger;
    private rooms = new Map<string, any>();
    private users = new Map<string, User>();

    @WebSocketServer() server;

    constructor() {
        this.logger = new Logger( AppGateway.name );
    }

    async afterInit () {
        this.logger.log( 'afterInit' );
    }

    async handleConnection ( client: any, ...args: any[] ) {
        // A client has connected
        this.logger.log( `connected ${client.id}` );
        // this.sockets[ client.id ] = client
    }

    async handleDisconnect ( client ) {
        this.users.delete( client.id );
        this.logger.log( `disconnected ${client.id}` );
    }

    @SubscribeMessage( 'users' )
    async handleRequestUsers ( client: any, room: string ) {
        this.logger.log( `handleRequestUsers ${room}` );

        client.emit( 'users', await this.getRoomUsers( room, false ) );
    }

    @SubscribeMessage( 'createRoom' )
    async handleCreateRoom ( client: any, payload: ConnectionData ) {
        this.logger.log( `handleCreateRoom ${payload}` );
        const room = new Room();
        const user = new User( client, payload.name, true );
        room.addUser( user );
        this.rooms[ room.id ] = room;
        this.users[ client.id ] = user;
        client.join( room.id );
        client.emit( 'myDetails', { name: user.name, isAdmin: user.isAdmin, room: room.id, voted: user.voted } );
    }

    @SubscribeMessage( 'joinRoom' )
    async handleJoinRoom ( client: any, payload: ConnectionData ) {
        this.logger.log( `handleJoinRoom ${payload}` );
        const room = this.rooms[ payload.room ];
        if ( room ) {
            let user;
            if ( this.users[ client.id ] ) {
                user = this.users[ client.id ];
            } else {
                user = new User( client, payload.name );
            }
            this.users[ client.id ] = user;
            room.addUser( user );
            client.join( payload.room );
            client.emit( 'myDetails', { name: user.name, isAdmin: user.isAdmin, room: room.id, voted: user.voted } );



            this.server.to( room.id ).emit( 'users', await this.getRoomUsers( payload.room, false ) );
        } else {
            client.emit( 'myDetails', false );
        }
    }

    @SubscribeMessage( 'leaveRoom' )
    handleLeaveRoom ( client: any, roomId: string ): void {
        const room: Room = this.rooms[ roomId ];
        room.removeUser( this.users[ client.id ] );
        client.leave( room );
    }


    @SubscribeMessage( 'vote' )
    async handleVote ( client: any, payload: any ) {
        this.logger.log( `handleVote ${payload}` );
        const user = this.users[ client.id ];
        user.voted = true;
        user.vote = payload.vote;
        const room: Room = this.rooms[ payload.room ];
        room.addFighter( user );
        this.server.to( payload.room ).emit( 'users', await this.getRoomUsers( payload.room, false ) );
        client.emit( 'myDetails', { name: user.name, isAdmin: user.isAdmin, room: payload.room, voted: user.voted, vote: user.vote } );
    }

    @SubscribeMessage( 'showVotes' )
    async handleShowVotes ( client: any, payload: any ) {
        const user: User = this.users[ client.id ];
        if ( user.isAdmin ) {
            const room: Room = this.rooms[ payload.room ];
            this.server.to( payload.room ).emit( 'users', await this.getRoomUsers( payload.room, true ) );
            this.server.to( payload.room ).emit( 'fighters', await room.fighters() );
        }

    }

    @SubscribeMessage( 'clearVotes' )
    async handleClearVotes ( client: any, payload: any ) {
        this.logger.log( `handleClearVotes ${payload}` );
        const user: User = this.users[ client.id ];
        if ( user.isAdmin ) {
            await this.rooms[ payload.room ].users.forEach( u => {
                u.voted = false;
                u.vote = false;
                u.socket.emit( 'myDetails', { name: u.name, isAdmin: u.isAdmin, room: payload.room, voted: u.voted, vote: u.vote } )
            } );
            const room: Room = this.rooms[ payload.room ];
            await room.resetFighters();
            this.server.to( payload.room ).emit( 'users', await this.getRoomUsers( payload.room, true ) );
            this.server.to( payload.room ).emit( 'fighters', await room.fighters() );
        }

    }



    async getRoomUsers ( room, showVote ) {
        return new Promise( ( resolve, reject ) => {
            resolve(
                this.rooms[ room ].users.map( u => {
                    return { name: u.name, voted: u.voted, vote: showVote ? u.vote : false };
                } )
            );
        } )
    }



}
