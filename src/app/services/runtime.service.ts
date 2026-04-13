import { Injectable, signal, effect, inject } from '@angular/core';
import { BuilderService } from './builder.service';

@Injectable({ providedIn: 'root' })
export class RuntimeService {
  private builder = inject(BuilderService);
  private readonly DATA_KEY = 'nicole_user_input_data';

  // Contient les valeurs saisies par l'utilisateur (ID du composant -> Valeur)
  userData = signal<Record<string, any>>(this.loadData());

  constructor() {
    // Sauvegarde automatique dans le localStorage dès qu'une valeur change
    effect(() => {
      localStorage.setItem(this.DATA_KEY, JSON.stringify(this.userData()));
    });
  }

  private loadData(): Record<string, any> {
    const saved = localStorage.getItem(this.DATA_KEY);
    return saved ? JSON.parse(saved) : {};
  }

  // La méthode qui était manquante ou mal nommée
  updateValue(id: string, val: any) {
    this.userData.update(data => ({ ...data, [id]: val }));
  }

  handleAction(action?: string) {
    if (!action) return;

    if (action.startsWith('goto:')) {
      const screenId = action.split(':')[1];
      this.builder.currentScreenId.set(screenId);
    } else if (action === 'submit') {
      alert('Données soumises (check console)');
      console.log('Données finales du formulaire :', this.userData());
    }
  }
}