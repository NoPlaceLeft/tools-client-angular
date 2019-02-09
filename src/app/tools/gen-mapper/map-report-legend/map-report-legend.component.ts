import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Device } from '@core/platform';
import { DocumentDto } from '@shared/entity/document.model';

import { GMReport, GMTemplate } from '../gen-mapper.interface';

@Component({
    selector: 'app-map-report-legend',
    templateUrl: './map-report-legend.component.html',
    styleUrls: ['./map-report-legend.component.scss']
})
export class MapReportLegendComponent implements OnChanges {
    @Input()
    public template: GMTemplate;

    @Input()
    public document: DocumentDto;

    public reports: GMReport[];
    public isDesktop = Device.isDesktop;

    public ngOnChanges(change: SimpleChanges): void {
        if (change.template && change.template.firstChange) {
            this.createReports();
        }

        if (change.document) {
            this.updateReports();
        }
    }

    private createReports(): void {
        this.reports = [];
        this.template.reports.forEach(rep => {
            const report = {} as GMReport;
            report.value = 0;
            report.name = rep.name;
            report.type = rep.type;
            this.reports.push(report);
        });
    }

    private updateReports(): void {
        this.reports.forEach(r => r.value = 0);

        this.document.nodes.forEach(node => {
            this.reports.forEach(report => {
                if (report.type === 'number') {
                    const v = parseFloat(node[report.name]) || 0;
                    report.value += v;
                }
                if (report.type === 'boolean') {
                    if (node[report.name]) {
                        report.value += 1;
                    }
                }
            });
        });
    }
}
