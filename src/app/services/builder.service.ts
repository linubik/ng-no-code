import { Injectable, signal, computed, effect } from '@angular/core';
import { Screen, ComponentConfig, ComponentType } from '../models/builder.model';

@Injectable({ providedIn: 'root' })
export class BuilderService {
  private readonly STORAGE_KEY = 'nicole_project_structure';

  isRuntimeMode = signal<boolean>(false);
  screens = signal<Screen[]>(this.loadFromStorage());
  currentScreenId = signal<string>(this.screens()[0]?.id || 'home');
  selectedComponentId = signal<string | null>(null);

  activeScreen = computed(() => 
    this.screens().find((s) => s.id === this.currentScreenId())
  );

  selectedComponent = computed(() => {
    const screen = this.activeScreen();
    return screen?.components.find((c) => c.id === this.selectedComponentId()) || null;
  });

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.screens()));
    });
  }

  private loadFromStorage(): Screen[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [{ id: 'home', name: 'Accueil', components: [] }];
    } catch (e) {
      return [{ id: 'home', name: 'Accueil', components: [] }];
    }
  }

  toggleMode() {
    const newMode = !this.isRuntimeMode();
    this.isRuntimeMode.set(newMode);
    if (newMode) {
      this.selectedComponentId.set(null);
    }
  }

  addComponent(type: ComponentType) {
    const newComp: ComponentConfig = {
      id: crypto.randomUUID(),
      type,
      label: `Nouveau ${type}`,
      options: (type === 'combo' || type === 'list') ? ['Option 1', 'Option 2'] : [],
      style: { color: '#000000' }
    };
    this.screens.update(screens => screens.map(s => 
      s.id === this.currentScreenId() ? { ...s, components: [...s.components, newComp] } : s
    ));
    this.selectedComponentId.set(newComp.id);
  }

  updateComponent(id: string, patch: Partial<ComponentConfig>) {
    this.screens.update(screens => screens.map(s => ({
      ...s, components: s.components.map(c => c.id === id ? { ...c, ...patch } : c)
    })));
  }

  addScreen(name: string) {
    const newScreen = { id: crypto.randomUUID(), name, components: [] };
    this.screens.update(s => [...s, newScreen]);
    this.currentScreenId.set(newScreen.id);
  }

  saveProject() {
    const data = JSON.stringify(this.screens(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mon_projet_mobile.json';
    a.click();
  }

  deleteComponent(id: string) {
    this.screens.update(screens => screens.map(s => ({
      ...s, components: s.components.filter(c => c.id !== id)
    })));
    this.selectedComponentId.set(null);
  }
}