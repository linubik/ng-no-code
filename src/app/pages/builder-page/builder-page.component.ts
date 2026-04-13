import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuilderService } from '../../services/builder.service';
import { DynamicRendererComponent } from '../../components/dynamic-renderer/dynamic-renderer.component';
// 1. IMPORTATION DU COMPOSANT
import { InspectorComponent } from '../../components/inspector/inspector.component';

@Component({
  selector: 'app-builder-page',
  standalone: true,
  // 2. AJOUT À LA LISTE DES IMPORTS
  imports: [
    CommonModule, 
    FormsModule, 
    DynamicRendererComponent, 
    InspectorComponent
  ],
  templateUrl: './builder-page.component.html',
  styleUrls: ['./builder-page.component.css'],
})
export class BuilderPageComponent {
  public builder = inject(BuilderService);
}