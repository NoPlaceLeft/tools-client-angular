import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Unsubscribable } from '@core/Unsubscribable';
import { takeUntil } from 'rxjs/operators';

import { PeopleGroupModel } from '../people-group.service';


@Component({
    selector: 'app-people-group-picker',
    templateUrl: './people-group-picker.component.html',
    styleUrls: ['./people-group-picker.component.scss']
})
export class PeopleGroupPickerComponent extends Unsubscribable implements OnInit {
    @Input()
    public selected: PeopleGroupModel[];

    @Input()
    public peopleGroups: PeopleGroupModel[];

    @Output()
    public selectionChange = new EventEmitter<PeopleGroupModel[]>();

    @ViewChild(MatPaginator)
    public paginator: MatPaginator;

    public displayedColumns: string[] = ['select', 'name'];
    public dataSource = new MatTableDataSource<PeopleGroupModel>();
    public selection = new SelectionModel<PeopleGroupModel>(true, []);

    public ngOnInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.data = this.peopleGroups;
        this.dataSource.filterPredicate = (d: PeopleGroupModel, f: string) => {
            f = f.trim().toLowerCase();
            return d.attributes.NmDisp.toLowerCase().indexOf(f) > -1
                || d.attributes.Ctry.toLowerCase().indexOf(f) > -1;
        };

        if (this.selected && this.selected.length) {
            this.selected.forEach(s => this.selection.select(s));
        }

        this.selection.changed
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(result => {
                this.selectionChange.emit(result.source.selected);
            });
    }

    public applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
