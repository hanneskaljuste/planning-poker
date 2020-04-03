export class User {
    private _id: string;
    private _voted: boolean;
    private _vote: number;
    constructor( private _socket: any, private _name: string, private _isAdmin: boolean = false ) {
        this._id = _socket.id;
        this._voted = false;
    }

    set name ( name: string ) {
        this._name = name;
    }
    get name (): string {
        return this._name;
    }
    get isAdmin (): boolean {
        return this._isAdmin;
    }

    get voted (): boolean {
        return this._voted;
    }
    set voted ( voted: boolean ) {
        this._voted = voted;
    }

    get vote (): number {
        return this._vote;
    }

    set vote ( vote: number ) {
        this._vote = vote;
    }

    get socket (): any {
        return this._socket;
    }

}
