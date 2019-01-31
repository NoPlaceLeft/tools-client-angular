import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Unsubscribable } from '@core/Unsubscribable';
import { takeUntil } from 'rxjs/operators';

import { GMField, GNode } from '../gen-mapper.interface';
import { MatDialog } from '@angular/material';
import { MapsService } from '@core/maps.service';
import { LocationDialogComponent } from '../dialogs/location-dialog/location-dialog.component';
import { PeopleGroupDialogComponent } from '../dialogs/people-group-dialog/people-group-dialog.component';

@Component({
    selector: 'app-edit-node-form',
    templateUrl: './edit-node-form.component.html',
    styleUrls: ['./edit-node-form.component.scss']
})
export class EditNodeFormComponent extends Unsubscribable implements OnInit {
    @Input()
    public model: GNode;

    @Input()
    public form: FormGroup;

    @Input()
    public nodes: any[];

    @Input()
    public fields: GMField[];

    constructor(
        private dialog: MatDialog,
        private mapService: MapsService
    ) { super(); }

    public ngOnInit(): void {
        if (this.form.get('generation')) {
            this.form.get('generation').valueChanges
                .pipe(takeUntil(this.unsubscribe))
                .subscribe(result => {
                    if (result < 0) {
                        this.form.get('generation').patchValue(0);
                    }
                });
        }

        if (this.form.get('location')) {
            this.form.get('location').disable();
        }

        if (this.form.get('peopleGroup')) {
            this.form.get('peopleGroup').disable();
        }
    }

    public onFieldClick(field: GMField): void {
        if (field.type === 'geoLocation') {
            this.onGeoLocationClick();
        }

        if (field.type === 'peidSelect') {
            this.onPeopleGroupClick();
        }
    }

    public onClearFieldClick(event: Event, field: GMField): void {
        event.preventDefault();
        event.stopPropagation();
        this.form.get(field.header).setValue(null);
    }

    private onGeoLocationClick(): void {
        this.mapService.getLocation().subscribe(result => {
            this.dialog
                .open(LocationDialogComponent, {
                    minWidth: '400px',
                    data: { coords: result.coords }
                })
                .afterClosed()
                .subscribe(address => {
                    if (address) {
                        this.form.get('location').patchValue(address);
                        this.form.get('location').updateValueAndValidity();
                        this.form.markAsDirty();
                    }
                });
        });
    }

    public onPeopleGroupClick(): void {
        this.dialog
            .open(PeopleGroupDialogComponent, {
                data: {}
            })
            .afterClosed()
            .subscribe(() => {

            });
    }
}
