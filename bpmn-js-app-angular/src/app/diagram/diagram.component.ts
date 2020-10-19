import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  SimpleChanges,
  EventEmitter
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import customControlsModule from '../custom';
/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */
// import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';

import { importDiagram } from './rx';

import { throwError } from 'rxjs';
import * as propertiesPanelModule from 'bpmn-js-properties-panel';
import * as propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';

import Modeler from 'bpmn-js/lib/Modeler.js';
 //import * as camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';




@Component({
  selector: 'app-diagram',
  templateUrl: 'diagram-component.html',
  // template: `
  //   <div #ref class="diagram-container"></div>
  // `,
  styles: [
    `
      .diagram-container {
        height: 100%;
        width: 100%;
      }
    `
  ]
})
export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy {
  private bpmnJS: Modeler;

  @ViewChild('ref', { static: true }) private el: ElementRef;

  @ViewChild('jspropertiespanel', { static: true }) private propertiespanelElement: ElementRef;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();

  @Input() private url: string;

  constructor(private http: HttpClient) {

    this.bpmnJS = new Modeler({
      propertiesPanel: {
        //parent: '#properties'
      },
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule,
        customControlsModule
      ],
      moddleExtensions: {
        // camunda: camundaModdleDescriptor
      }
    });

    this.bpmnJS.on('import.done', ({ error }) => {
      if (!error) {
        this.bpmnJS.get('canvas').zoom('fit-viewport');
      }
    });
  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes.url) {
      this.loadUrl(changes.url.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string) {

    return (
      this.http.get(url, { responseType: 'text' }).pipe(
        catchError(err => throwError(err)),
        importDiagram(this.bpmnJS)
      ).subscribe(
        (warnings) => {
          this.importDone.emit({
            type: 'success',
            warnings
          });
        },
        (err) => {
          this.importDone.emit({
            type: 'error',
            error: err
          });
        }
      )
    );
  }
}
