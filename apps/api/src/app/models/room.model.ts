import { User } from './user.model';
import { v4 as UUID } from 'uuid';
export class Room {
    private _id: string;
    private _users: User[] = [];

    private _max = 0;
    private _min = 22;

    private _maxFighters: User[] = [];
    private _minFighters: User[] = [];

    constructor() {
        this._id = UUID();
    }

    get id (): string {
        return this._id;
    }

    get users (): User[] {
        return this._users;
    }

    addUser ( user: User ): Room {
        this._users.push( user );
        return this;
    }

    removeUser ( user: User ): Room {
        const index = this._users.indexOf( user, 0 );
        if ( index > -1 ) {
            this._users.splice( index, 1 );
            return this;
        }
        return this;
    }


    resetFighters () {
        this._max = 0;
        this._min = 22;
        this._maxFighters = [];
        this._minFighters = [];
    }
    addFighter ( user: User ) {
        if ( user.vote < this._min ) {
            this._min = user.vote;
            this._minFighters = [ user ];
        } else if ( user.vote === this._min ) {
            this._minFighters.push( user );
        }
        if ( user.vote > this._max ) {
            this._max = user.vote;
            this._maxFighters = [ user ];
        } else if ( user.vote === this._max ) {
            this._maxFighters.push( user );
        }

    }


    async fighters () {
        const maxF = this._maxFighters[ Math.floor( Math.random() * this._maxFighters.length ) ];
        const minF = this._minFighters[ Math.floor( Math.random() * this._minFighters.length ) ];
        return { maxFighter: !maxF || !minF || maxF.vote === minF.vote ? false : maxF.name, minFighter: !maxF || !minF || maxF.vote === minF.vote ? false : minF.name };
    }

}
