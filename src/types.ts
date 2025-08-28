export interface FormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  value?: string;
  required?: boolean;
}

export interface AutomationTask {
  id: string;
  url: string;
  description: string;
  fields: FormField[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: Date;
}

export interface BrowserAction {
  type: 'navigate' | 'click' | 'type' | 'select' | 'submit' | 'screenshot';
  selector?: string;
  value?: string;
  coordinates?: { x: number; y: number };
}
