import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MenuComponent } from "./menu.component";
import { TranslateModule } from "@ngx-translate/core";

import { RouterTestingModule } from "@angular/router/testing";

describe("DetailComponent", () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render title in a h1 tag", async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("h1").textContent).toContain(
      "PAGES.DETAIL.TITLE"
    );
  }));
});
