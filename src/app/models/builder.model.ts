export type ComponentType = 'input' | 'date' | 'list' | 'combo' | 'button';

export interface ComponentConfig {
  id: string;
  type: ComponentType;
  label: string;
  value?: any;
  options?: string[];
  action?: string;
  style?: { [key: string]: string };
}

export interface Screen {
  id: string;
  name: string;
  components: ComponentConfig[];
}
