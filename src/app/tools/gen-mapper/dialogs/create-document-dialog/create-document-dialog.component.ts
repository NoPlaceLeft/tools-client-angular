import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { isAuthenticated } from '@npl-auth';
import { Unsubscribable } from '@npl-core/Unsubscribable';
import { AppState, TeamSelectors } from '@npl-data-access';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-create-document-dialog',
    templateUrl: './create-document-dialog.component.html',
    styleUrls: ['./create-document-dialog.component.scss']
})
export class CreateDocumentDialogComponent extends Unsubscribable implements OnInit {

    public readonly teams$ = this.store.select(TeamSelectors.getEntities);
    public form: FormGroup;
    public showTeams: boolean;

    constructor(
        private store: Store<AppState>,
        private dialogRef: MatDialogRef<CreateDocumentDialogComponent>
    ) {
        super();

        this.store.select(isAuthenticated)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(authenticated => {
                this.showTeams = authenticated;
            });
    }

    public ngOnInit(): void {
        this.form = new FormGroup({
            title: new FormControl('',
                [Validators.minLength(2), Validators.required]
            ),
            teamId: new FormControl()
        });
    }

    public onSubmit(): void {
        this.dialogRef.close(this.form.value);
    }
}
