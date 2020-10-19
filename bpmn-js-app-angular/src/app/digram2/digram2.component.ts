import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import Modeler from 'bpmn-js/lib/Modeler.js';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
// import * as camundaModdleDescriptor from './data.json';


@Component({
  selector: 'app-digram2',
  templateUrl: './digram2.component.html',
  styleUrls: ['./digram2.component.css']
})
export class Digram2Component implements OnInit {
  title = 'Workflow Modeler';
  modeler: Modeler;
  @ViewChild('canvas') private canvasref: ElementRef;
  constructor(private http: HttpClient) {
    const ssa: any = this.modeler = new Modeler({
      container: '#canvas',
      width: '100%',
      height: '600px',
      propertiesPanel: {
        parent: '#properties'
      },
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule
      ],
      moddleExtensions: {
       // camunda: camundaModdleDescriptor
      }
    });
    this.load();
  }
  load(): void {
    this.getExample().subscribe(data => { this.modeler.importXML(data, value => this.handleError(value)); });
  }

  handleError(err: any) {
    if (err) {
      console.warn('Ups, error: ', err);
    }
  }

  public getExample(): Observable<string> {
    const url = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
    return this.http.get(url, { responseType: 'text' });
  }
  ngOnInit(): void {
  }

}
