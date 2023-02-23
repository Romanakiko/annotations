import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationParamsComponent } from './annotation-params.component';

describe('AnnotationParamsComponent', () => {
  let component: AnnotationParamsComponent;
  let fixture: ComponentFixture<AnnotationParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnotationParamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotationParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
