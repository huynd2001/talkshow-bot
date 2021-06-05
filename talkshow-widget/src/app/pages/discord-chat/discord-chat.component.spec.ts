import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscordChatComponent } from './discord-chat.component';

describe('DiscordChatComponent', () => {
  let component: DiscordChatComponent;
  let fixture: ComponentFixture<DiscordChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscordChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscordChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
