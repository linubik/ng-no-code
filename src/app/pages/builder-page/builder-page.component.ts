import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { BuilderService } from '../../services/builder.service';
import { DynamicRendererComponent } from '../../components/dynamic-renderer/dynamic-renderer.component';

@Component({
  selector: 'app-builder-page',
  standalone: true,
  imports: [FormsModule, DynamicRendererComponent, DragDropModule],
  templateUrl: './builder-page.component.html',
  styleUrls: ['./builder-page.component.css'],
})
export class BuilderPageComponent {
  public builder = inject(BuilderService);

  drop(event: CdkDragDrop<any[]>) {
    const activeScreen = this.builder.activeScreen();
    if (activeScreen) {
      const newComponents = [...activeScreen.components];
      moveItemInArray(newComponents, event.previousIndex, event.currentIndex);

      this.builder.screens.update((allScreens) =>
        allScreens.map((s) =>
          s.id === activeScreen.id ? { ...s, components: newComponents } : s
        )
      );
    }
  }

  promptNewScreen() {
    const name = window.prompt("Nom de l'écran ?");
    if (name) this.builder.addScreen(name);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.builder.importProject(e.target.result);
      };
      reader.readAsText(file);
    }
  }
}
