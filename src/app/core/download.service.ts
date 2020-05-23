import { Injectable } from '@angular/core';
import { DocumentDto } from '@models/document.model';
import { NodeDto } from '@models/node.model';
import { saveAs } from 'file-saver';
import { JSONToCSV } from './json-to-csv';
import { TemplateService } from './template.service';


@Injectable({
    providedIn: 'root'
})
export class DownloadService {

    constructor(
        private templateService: TemplateService
    ) { }

    public downloadDocument(doc: DocumentDto, nodes: NodeDto[]): void {
        const template = this.templateService.getTemplate(doc.type);
        const content = JSONToCSV(nodes, template);
        this.downloadCSV(content, doc.title);
    }

    public downloadCSV(content: string, title: string): void {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, title + '.csv');
    }
}
