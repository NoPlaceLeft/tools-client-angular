import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';

import { DonateButtonComponent } from './donate-button/donate-button.component';
import { FileInputDialogComponent } from './file-input-dialog/file-input-dialog.component';
import { JoinListPipe } from './join-list.pipe';
import { MaterialModule } from './material/material.module';
import { NplLogoComponent } from './npl-logo/npl-logo.component';
import { NumberInputDirective } from './number-input.directive';
import { SidenavToggleComponent } from './sidenav-toggle/sidenav-toggle.component';
import { SortByDatePipe } from './sort-by-date.pipe';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MaterialModule,
        TranslateModule
    ],
    declarations: [
        SidenavToggleComponent,
        SortByDatePipe,
        FileInputDialogComponent,
        NplLogoComponent,
        JoinListPipe,
        DonateButtonComponent,
        NumberInputDirective,
    ],
    exports: [
        MaterialModule,
        FlexLayoutModule,
        SidenavToggleComponent,
        SortByDatePipe,
        FileInputDialogComponent,
        NplLogoComponent,
        JoinListPipe,
        DonateButtonComponent,
        NumberInputDirective,
    ],
    entryComponents: [
        FileInputDialogComponent
    ]
})
export class SharedModule { }
