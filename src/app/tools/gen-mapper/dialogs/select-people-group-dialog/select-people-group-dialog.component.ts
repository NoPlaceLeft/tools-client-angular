import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PeopleGroupService } from '@npl-core/people-group.service';
import { Device } from '@npl-core/platform';
import { Unsubscribable } from '@npl-core/Unsubscribable';
import { OtherPeopleGroup, PeopleAttributes, PeopleGroupConfig, PeopleGroupModelItem, Template } from '@npl-data-access';
import { COUNTRIES } from '@npl-template';
import { cloneDeep } from 'lodash';
import { takeUntil } from 'rxjs/operators';

export interface AddPeopleGroupConfig {
    countryCode: string;
    template: Template;
    peoples: PeopleAttributes[];
    selectedPeople?: PeopleAttributes,
}

@Component({
    selector: 'app-select-people-group-dialog',
    templateUrl: './select-people-group-dialog.component.html',
    styleUrls: ['./select-people-group-dialog.component.scss']
})
export class SelectPeopleGroupDialogComponent extends Unsubscribable implements OnInit {
    private peopleGroupConfig: PeopleGroupConfig;

    public isHandHeld = Device.isHandHeld;
    public isLoading: boolean = true;
    public peopleGroups: PeopleGroupModelItem[];
    public countryControl = new FormControl();
    public otherControl = new FormControl(null, [Validators.required]);
    public pgControl = new FormControl();
    public showOther: boolean;

    public readonly countryList = COUNTRIES;
    public readonly other = OtherPeopleGroup;

    constructor(
        private peopleGroupService: PeopleGroupService,
        private dialogRef: MatDialogRef<SelectPeopleGroupDialogComponent, PeopleAttributes>,
        @Inject(MAT_DIALOG_DATA) public data: AddPeopleGroupConfig,
    ) {
        super();

        if (!this.data.countryCode) {
            this.data.countryCode = COUNTRIES[0]["alpha-3"];
        }

        this.countryControl.patchValue(this.data.countryCode);
        this.setCountryCode(this.data.countryCode);
    }

    public ngOnInit() {
        this.countryControl.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(countryCode => {
            this.setCountryCode(countryCode);
        });

        this.pgControl.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(result => {
            this.showOther = parseFloat(result) === OtherPeopleGroup.PEID;
        });

        this.peopleGroupService.load().subscribe(result => {
            this.peopleGroupConfig = result;
            this.isLoading = false;
            this.setCountryCode(this.countryControl.value);
        });
    }

    public continue(): void {
        const peopleField = this.data.template.getField('peoples');
        const PEID = parseFloat(this.pgControl.value);
        const pg = this.peopleGroupService.getByPeid(PEID);

        let people = {} as PeopleAttributes;

        if (this.data.selectedPeople) {
            people = cloneDeep(this.data.selectedPeople);
        } else {
            peopleField.fields.forEach(field => {
                people[field.id] = field.defaultValue;
            });
        }

        people.identifier = pg.PEID;
        people.label = pg.NmDisp;
        people.placeOfOrigin = this.countryControl.value;

        if (people.identifier === OtherPeopleGroup.PEID) {
            people.label = this.otherControl.value;

            if (this.checkExistingOther(people)) {
                this.otherControl.setErrors({ existing: true });
                return;
            }
        }

        this.dialogRef.close(people);
    }

    public get isValid(): boolean {
        if (!this.countryControl.value) {
            return false;
        }

        if (!this.pgControl.value) {
            return false;
        }

        if (this.pgControl.value === OtherPeopleGroup.PEID && !this.otherControl.value) {
            return false;
        }

        return true;
    }

    private setCountryCode(countryCode: string): void {
        if (this.peopleGroupConfig) {
            this.peopleGroups = this.filterPeopleGroups(this.peopleGroupConfig.byCountry[countryCode]);
            this.pgControl.patchValue(null);
        }
    }

    private filterPeopleGroups(peopleGroups: PeopleGroupModelItem[]): PeopleGroupModelItem[] {
        if (!peopleGroups) {
            return [];
        }

        return peopleGroups.filter(p => {
            return !this.data.peoples.find(n => n.identifier === p.PEID);
        });
    }

    private checkExistingOther(people: PeopleAttributes): boolean {
        const len = this.data.peoples.length;
        for (let i = 0; i < len; i++) {
            const item = this.data.peoples[i];
            if (item.identifier === people.identifier && item.placeOfOrigin === people.placeOfOrigin && item.label.toLowerCase() === people.label.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
}
