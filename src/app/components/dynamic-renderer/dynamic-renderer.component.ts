import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentConfig } from '../../models/builder.model';
import { RuntimeService } from '../../services/runtime.service';
import { BuilderService } from '../../services/builder.service';

@Component({
  selector: 'app-dynamic-renderer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div [style]="config().style" class="component-wrapper">
      <label class="comp-label">{{ config().label }}</label>

      @switch (config().type) {
        @case ('input') {
          <input type="text" 
                 [disabled]="!builder.isRuntimeMode()"
                 [ngModel]="runtime.userData()[config().id] || ''" 
                 (ngModelChange)="runtime.updateValue(config().id, $event)">
        }

        @case ('date') {
          <input type="date" 
                 [disabled]="!builder.isRuntimeMode()"
                 [ngModel]="runtime.userData()[config().id] || ''" 
                 (ngModelChange)="runtime.updateValue(config().id, $event)">
        }

        @case ('combo') {
          <select [disabled]="!builder.isRuntimeMode()"
                  [ngModel]="runtime.userData()[config().id] || ''" 
                  (ngModelChange)="runtime.updateValue(config().id, $event)">
            <option value="">Sélectionnez...</option>
            @for (opt of config().options; track opt) {
              <option [value]="opt">{{ opt }}</option>
            }
          </select>
        }

        @case ('button') {
          <button type="button" 
                  (click)="onButtonClick()">
            {{ config().label }}
          </button>
        }
      }
    </div>
  `,
  styles: [`
    .component-wrapper { display: flex; flex-direction: column; gap: 4px; width: 100%; margin-bottom: 12px; }
    .comp-label { font-weight: 500; font-size: 14px; color: #333; }
    input, select, button { padding: 10px; border-radius: 6px; border: 1px solid #ccc; font-size: 14px; }
    button { background: #007bff; color: white; border: none; cursor: pointer; transition: 0.2s; }
    button:hover { background: #0056b3; }
    input:disabled, select:disabled { background: #f9f9f9; cursor: default; }
  `]
})
export class DynamicRendererComponent {
  config = input.required<ComponentConfig>();
  
  public runtime = inject(RuntimeService);
  public builder = inject(BuilderService);

  onButtonClick() {
    // On n'exécute l'action que si on est en mode Runtime
    if (this.builder.isRuntimeMode()) {
      this.runtime.handleAction(this.config().action);
    } else {
      console.log('Action ignorée (Mode Builder) :', this.config().action);
    }
  }
}