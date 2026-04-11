import { Injectable, signal, computed } from '@angular/core';
import {
  Screen,
  ComponentConfig,
  ComponentType,
} from '../models/builder.model';

@Injectable({ providedIn: 'root' })
export class BuilderService {
  screens = signal<Screen[]>([{ id: 'home', name: 'Accueil', components: [] }]);

  currentScreenId = signal<string>('home');
  selectedComponentId = signal<string | null>(null);

  activeScreen = computed(() =>
    this.screens().find((s) => s.id === this.currentScreenId())
  );

  addComponent(type: ComponentType) {
    const newComp: ComponentConfig = {
      id: crypto.randomUUID(),
      type,
      label: `Nouveau ${type}`,
      options:
        type === 'combo' || type === 'list' ? ['Option 1', 'Option 2'] : [],
    };
    this.updateCurrentScreenComponents([
      ...(this.activeScreen()?.components || []),
      newComp,
    ]);
  }

  private updateCurrentScreenComponents(components: ComponentConfig[]) {
    this.screens.update((all) =>
      all.map((s) =>
        s.id === this.currentScreenId() ? { ...s, components } : s
      )
    );
  }

  addScreen(name: string) {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const newScreen: Screen = { id, name, components: [] };
    this.screens.update((all) => [...all, newScreen]);
    this.currentScreenId.set(id);
  }

  // --- SAUVEGARDE ET IMPORTATION ---

  saveProject() {
    const projectData = {
      version: '1.0',
      screens: this.screens(),
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projet-nocode.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  importProject(jsonContent: string) {
    try {
      const data = JSON.parse(jsonContent);
      if (data.screens && Array.isArray(data.screens)) {
        this.screens.set(data.screens);
        // On se repositionne sur le premier écran importé
        if (data.screens.length > 0) {
          this.currentScreenId.set(data.screens[0].id);
        }
        this.selectedComponentId.set(null);
      }
    } catch (e) {
      console.error('Erreur lors de la lecture du JSON', e);
      alert('Fichier JSON invalide.');
    }
  }
}
