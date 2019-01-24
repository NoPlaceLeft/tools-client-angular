import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material';
import { AuthenticationService } from '@core/authentication.service';
import { Unsubscribable } from '@core/Unsubscribable';
import { DocumentDto } from '@shared/entity/document.model';
import { takeUntil } from 'rxjs/operators';

import { GMTemplate } from '../gen-mapper.interface';
import { GenMapperService } from '../gen-mapper.service';
import { NodeClipboardService } from '../node-clipboard.service';

@Component({
    selector: 'app-gen-mapper-container',
    templateUrl: './gen-mapper-container.component.html',
    styleUrls: ['./gen-mapper-container.component.scss'],
    providers: []
})
export class GenMapperContainerComponent extends Unsubscribable implements OnInit, OnDestroy {
    public documents: DocumentDto[];
    public document: DocumentDto;
    public template: GMTemplate;
    public isAuthenticated: boolean;

    @ViewChild('matDrawer')
    public matDrawer: MatDrawer;

    constructor(
        private genMapper: GenMapperService,
        private authService: AuthenticationService,
        private nodeClipboard: NodeClipboardService,
    ) { super(); }

    public ngOnInit(): void {
        this.isAuthenticated = this.authService.isAuthenticated();

        this.genMapper.getDocument()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(document => {
                this.document = document;
            });

        this.genMapper.getConfig()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(config => {
                this.template = config.template;
                this.documents = config.documents;
            });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.genMapper.setDocument(null);
        this.nodeClipboard.set(null);
    }
}