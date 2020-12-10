import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
    selector: 'planning-poker-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
    public user: any;
    public users: any[];
    public scales = [1, 2, 3, 5, 8, 13, 21];

    maxFighter = null;
    minFighter = null;

    lockVote = false;
    constructor(
        private service: AppService,
        private router: Router,
        private ref: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.user = this.service.getMyDetails();
        this.service.getDetails().subscribe(d => {
            this.service.setMyDetails(d);
            this.user = this.service.getMyDetails();
        });
        if (!this.user) {
            this.router.navigate(['']);
        } else {
            this.service.getUsers().subscribe(u => {
                console.log(u)
                this.users = u;
                if (u.filter(usr => usr.vote).length > 0) {
                    this.lockVote = true;
                } else {
                    this.lockVote = false;
                }
            });
            this.service.requestUsers(this.user.room);
        }


        this.service.getFighters().subscribe(f => {
            console.log('fighters', f);
            this.maxFighter = f.maxFighter;
            this.minFighter = f.minFighter;
        });

    }

    castVote(scale: number) {
        if (!this.lockVote) {
            this.service.castVote({ vote: scale, room: this.user.room });
        }

    }

    changeAdmin(user, index) {
        this.service.changeAdmin({ room: this.user.room, newAdmin: user, index: index })
        this.service.getDetails().subscribe(d => {
            this.service.setMyDetails(d);
            this.user = this.service.getMyDetails();
        });
    }

    showVotes() {
        if (this.user.isAdmin) {
            this.service.showVotes(this.user.room);
        }
    }
    clearVotes() {
        if (this.user.isAdmin) {
            this.service.clearVotes(this.user.room);
        }
    }
    copyToClipboard(item: string) {
        console.log(location.href)
        document.addEventListener('copy', (e: ClipboardEvent) => {
            e.clipboardData.setData('text/plain', (location.href + '/' + item));
            e.preventDefault();
            document.removeEventListener('copy', null);
        });
        document.execCommand('copy');
        console.log(item)
    }


}
