import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '../../models/builder.model';

@Component({
  selector: 'app-dynamic-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-renderer.component.html',
  styles: [
    `
    .renderer-wrapper { display: flex; flex-direction: column; gap: 5px; pointer-events: none; }
    .form-control, .form-select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 100%; }
    .btn-primary { background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; width: fit-content; }
    label { font-weight: bold; font-size: 14px; color: #555; }
  `,
  ],
})
export class DynamicRendererComponent {
  config = input.required<ComponentConfig>();
}
