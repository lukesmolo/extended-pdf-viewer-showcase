
import { Component, ViewChild, OnInit, ComponentFactoryResolver, ApplicationRef, Injector, OnDestroy, AfterViewInit } from '@angular/core';
import {CdkPortal,DomPortalHost, DomPortalOutlet} from '@angular/cdk/portal';

/**
 * This component template wrap the projected content
 * with a 'cdkPortal'.
 */

@Component({
  selector: 'app-window',
  template: `
    <ng-container *cdkPortal>
      <mat-card class="distance-16 mat-elevation-z8">
        <ngx-extended-pdf-viewer [src]="'assets/pdfs/pdf-sample.pdf'" [height]="'90vh'" [useBrowserLocale]="true">
        </ngx-extended-pdf-viewer>
      </mat-card>
    </ng-container>
  `
})
export class WindowComponent implements AfterViewInit, OnDestroy {

  // STEP 1: get a reference to the portal
  @ViewChild(CdkPortal) portal: CdkPortal;

  // STEP 2: save a reference to the window so we can close it
  private externalWindow = null;

  // STEP 3: Inject all the required dependencies for a PortalHost
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector){}


  ngAfterViewInit(){
    // STEP 4: create an external window
    this.externalWindow = window.open('', '', 'width=600,height=400,left=200,top=200');

    this.externalWindow.webViewerLoad = (window as any).webViewerLoad;
    this.externalWindow.PDFViewerApplication = (window as any).PDFViewerApplication;
    this.externalWindow.PDFViewerApplicationOptions = (window as any).PDFViewerApplicationOptions;

    // STEP 5: create a PortalHost with the body of the new window document
    const host = new DomPortalOutlet(
      this.externalWindow.document.body,
      this.componentFactoryResolver,
      this.applicationRef,
      this.injector
      );

    // STEP 6: Attach the portal
    host.attach(this.portal);
  }

  ngOnDestroy(){
    // STEP 7: close the window when this component destroyed
    this.externalWindow.close()
  }
}
