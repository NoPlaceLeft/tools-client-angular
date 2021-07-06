import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState, TeamCreateDto, TeamUiActions } from '@npl-data-access';

@Component({
    selector: 'app-team-create-dialog',
    templateUrl: './team-create-dialog.component.html',
    styleUrls: ['./team-create-dialog.component.scss']
})
export class TeamCreateDialogComponent {

    public readonly form = new FormGroup({
        name: new FormControl(null, [Validators.required])
    });

    public isCreating: boolean;

    constructor(
        private store: Store<AppState>,
        private dialogRef: MatDialogRef<TeamCreateDialogComponent>
    ) { }

    public create(): void {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.isCreating) {
            return;
        }

        this.isCreating = true;
        const dto: TeamCreateDto = this.form.value;
        this.store.dispatch(TeamUiActions.create({
            dto,
            onComplete: () => {
                this.dialogRef.close();
            }
        }));
    }
}
