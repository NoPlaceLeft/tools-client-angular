import { Injectable } from '@angular/core';
import { CSVToJSON, CSVToJSONNoTemplate } from '@core/csv-to-json';
import { EntityService } from '@core/entity.service';
import { TemplateService } from '@core/template.service';
import { DocumentDto } from '@models/document.model';
import { EntityType } from '@models/entity.model';
import { IFlatNode, NodeAttributes, NodeDto } from '@models/node.model';
import { cloneDeep } from 'lodash';
import uuid from 'uuid';
import { NodeTreeService } from '../../tools/gen-mapper/node-tree/node-tree.service';

@Injectable({
    providedIn: 'root'
})
export class MigrationService {

    nodeTree = new NodeTreeService();

    constructor(
        private entityService: EntityService,
        private templateService: TemplateService
    ) { }

    public migrateDocuments(): void {
        this.entityService
            .getAll<DocumentDto>(EntityType.AllDocuments)
            .subscribe(docs => {

                const requests: any[] = [];
                let nodesSize = 0;
                docs.forEach(doc => {

                    const template = this.templateService.getTemplate(doc.type);
                    let nodes: IFlatNode[];

                    if (!template) {
                        // console.log(doc.type);
                        if (doc.type === 'disciples' || doc.type === 'fourFields') {
                            nodes = CSVToJSONNoTemplate(doc.type, doc.content);
                        } else {
                            console.log(doc.type);
                        }

                        return;
                    } else {
                        nodes = CSVToJSON(doc.content, template);
                    }

                    if (!nodes) {
                        return;
                    }

                    if (!this.nodeTree.validateTree(nodes)) {
                        console.log(doc.id, doc.type);
                        return;
                    }

                    requests.push({
                        document: doc,
                        nodes: this.batchCreateDtos(doc, nodes)
                    });

                    nodesSize += nodes.length;
                });

                console.log(nodesSize);
                console.log(requests.length);

                // const batch = (req, list: any[]) => {
                //     this.entityService.customPost(`documents/${req.document.id}/nodes/batch`, req.nodes)
                //         .subscribe(success => {
                //             batch(list.pop(), list)
                //         }, error => console.log(error))
                // }

                // batch(requests.pop(), requests);
            })
    }

    public batchCreateDtos(doc: DocumentDto, nodes: IFlatNode[]) {
        const idMap = {};
        const dtos = [];

        nodes.forEach(node => {
            const dto = new NodeDto();
            const newId = uuid();
            idMap[node.id] = newId;
            dto.id = newId;
            dto.documentId = doc.id;
            dto.attributes = cloneDeep(node) as unknown as NodeAttributes;
            dtos.push(dto);
        })

        dtos.forEach(dto => {
            if (dto.attributes.parentId) {
                const parentId = idMap[dto.attributes.parentId];
                if (parentId) {
                    dto.parentId = parentId;
                }
            }

            delete dto.attributes.id;
            delete dto.attributes.parentId;
        });

        return dtos;

        // return of();
        return this.entityService.customPost(`documents/${doc.id}/nodes/batch`, dtos);
    }
}
