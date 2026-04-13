import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuilderService } from '../../services/builder.service';

@Component({
  selector: 'app-inspector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inspector-panel">
      @if (builder.selectedComponent(); as comp) {
        <div class="header">
          <h3>Propriétés</h3>
          <span class="badge">{{ comp.type }}</span>
        </div>

        <div class="field">
          <label>Libellé</label>
          <input [ngModel]="comp.label" (ngModelChange)="update('label', $event)">
        </div>

        @if (comp.type === 'button') {
          <div class="field">
            <label>Action</label>
            <select [ngModel]="comp.action" (ngModelChange)="update('action', $event)">
              <option value="">Aucune</option>
              <option value="submit">Soumettre</option>
              @for (screen of builder.screens(); track screen.id) {
                <option [value]="'goto:' + screen.id">Aller à : {{ screen.name }}</option>
              }
            </select>
          </div>
        }

        @if (comp.type === 'combo' || comp.type === 'list') {
          <div class="field">
            <label>Options (séparées par virgules)</label>
            <textarea [ngModel]="comp.options?.join(', ')" 
                      (ngModelChange)="updateOptions($event)"></textarea>
          </div>
        }

        <button class="btn-delete" (click)="builder.deleteComponent(comp.id)">
          Supprimer le composant
        </button>
      } @else {
        <p class="empty-msg">Sélectionnez un composant pour l'éditer.</p>
      }
    </div>
  `,
  styles: [`
    .inspector-panel { padding: 1rem; border-left: 1px solid #ddd; height: 100%; background: #fff; }
    .header { margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; }
    .badge { background: #eee; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; }
    .field { margin-bottom: 1rem; display: flex; flex-direction: column; }
    label { font-size: 0.8rem; font-weight: bold; margin-bottom: 0.3rem; color: #666; }
    input, select, textarea { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    .btn-delete { width: 100%; margin-top: 2rem; background: #ff4d4f; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; }
    .empty-msg { text-align: center; color: #999; margin-top: 3rem; }
  `]
})
export class InspectorComponent {
  public builder = inject(BuilderService);

  update(key: string, value: any) {
    const selected = this.builder.selectedComponent();
    if (selected) {
      this.builder.updateComponent(selected.id, { [key]: value });
    }
  }

  updateOptions(text: string) {
    const options = text.split(',').map(s => s.trim()).filter(s => s !== '');
    this.update('options', options);
  }
}