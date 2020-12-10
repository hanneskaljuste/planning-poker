import { Inject } from '@angular/core';

import { share } from 'rxjs/operators';

import * as io from 'socket.io-client';

import { SocketIoConfig } from './socket-io.config';
import { Observable } from 'rxjs';


export class WrappedSocket {
    subscribersCounter = 0;
    ioSocket: any;
    emptyConfig: SocketIoConfig = {
        url: '',
        options: {}
    };

    constructor( public config: SocketIoConfig ) {
        if ( config === undefined ) config = this.emptyConfig;
        const url: string = config.url;
        const options: any = config.options;
        const ioFunc = ( io as any ).default ? ( io as any ).default : io;
        this.ioSocket = ioFunc( url, options );
    }

    of ( namespace: string ) {
        this.ioSocket.of( namespace );
    }

    on ( eventName: string, callback: Function ) {
        this.ioSocket.on( eventName, callback );
    }

    once ( eventName: string, callback: Function ) {
        this.ioSocket.once( eventName, callback );
    }

    connect () {
        return this.ioSocket.connect();
    }

    disconnect ( close?: any ) {
        return this.ioSocket.disconnect.apply( this.ioSocket, arguments );
    }

    emit ( eventName: string, data?: any, callback?: Function ) {
        // TODO: remember this, arguments
        
        return this.ioSocket.emit.apply( this.ioSocket, arguments );
    }

    removeListener ( eventName: string, callback?: Function ) {
        return this.ioSocket.removeListener.apply( this.ioSocket, arguments );
    }

    removeAllListeners ( eventName?: string ) {
        return this.ioSocket.removeAllListeners.apply( this.ioSocket, arguments );
    }

    fromEvent<T> ( eventName: string ): Observable<any> {
        this.subscribersCounter++;

        // return new Observable( ( observer: any ) => {
        //     this.ioSocket.on( eventName, ( data: T ) => {
        //         observer.next( data );
        //     } );
        //     return () => {
        //         if ( this.subscribersCounter === 1 ) {
        //             console.log( 'WrappedSocket fromEvent removing listener' );
        //             this.ioSocket.removeAllListener( eventName );
        //         }
        //     }
        // } );
        return Observable.create( ( observer: any ) => {
            this.ioSocket.on( eventName, ( data: T ) => {
                observer.next( data );
            } );
            return () => {
                if ( this.subscribersCounter === 1 ) {
                    console.log( 'WrappedSocket fromEvent removing listener' );
                    this.ioSocket.removeListener( eventName );
                }


            };
        } ).pipe(
            share()
        );
    }

    fromOneTimeEvent<T> ( eventName: string ): Promise<T> {
        return new Promise<T>( resolve => this.once( eventName, resolve ) );
    }
}
