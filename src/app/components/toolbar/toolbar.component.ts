import { Component, inject } from '@angular/core';
import { BuilderService } from '../../services/builder.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  template: `
    <div class="toolbar-btns">
      <button (click)="builder.saveProject()" class="btn-save">
        💾 Exporter JSON
      </button>
      
      <label class="btn-import">
        📂 Importer
        <input type="file" (change)="onFileSelected($event)" accept=".json" hidden>
      </label>
    </div>
  `,
  styles: [`
    .toolbar-btns { display: flex; gap: 10px; padding: 10px; background: #2c3e50; }
    button, .btn-import { 
      padding: 8px 15px; border-radius: 4px; border: none; 
      cursor: pointer; font-family: sans-serif; font-size: 14px;
    }
    .btn-save { background: #27ae60; color: white; }
    .btn-import { background: #3498db; color: white; display: inline-block; }
  `]
})
export class ToolbarComponent {
  public builder = inject(BuilderService);

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const content = JSON.parse(e.target.result);
        // On gère si le JSON est le tableau directement ou l'objet projet complet
        const screens = content.screens ? content.screens : content;
        this.builder.importProject(screens);
      };
      reader.readAsText(file);
    }
  }
}