export type ComponentType = 'input' | 'date' | 'list' | 'combo' | 'button';

export interface ComponentConfig {
  id: string;
  type: ComponentType;
  label: string;
  value?: any;
  options?: string[];
  action?: string; // Format attendu : 'goto:ID_ECRAN'
  style?: { [key: string]: string };
}

export interface Screen {
  id: string;
  name: string;
  components: ComponentConfig[];
}

// Structure pour le LocalStorage
export interface UserData {
  [componentId: string]: any;
}