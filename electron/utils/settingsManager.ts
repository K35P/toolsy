import fs from 'fs';
import path from 'path';
import { app } from 'electron';

interface AppSettings {
  language: string;
  outputPath: string;
  theme: string;
  sidePanelCollapsed: boolean;
}

class SettingsManager {
  private settingsPath: string;
  private settings: AppSettings;

  constructor() {
    this.settingsPath = path.join(app.getPath('userData'), 'settings.json');
    this.settings = this.loadSettings();
  }

  private loadSettings(): AppSettings {
    try {
      if (fs.existsSync(this.settingsPath)) {
        const data = fs.readFileSync(this.settingsPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Errore nel caricare le impostazioni:', error);
    }

    // Default settings
    return {
      language: 'it',
      outputPath: '',
      theme: 'light',
      sidePanelCollapsed: false
    };
  }

  private saveSettings(): void {
    try {
      const dir = path.dirname(this.settingsPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.settingsPath, JSON.stringify(this.settings, null, 2));
    } catch (error) {
      console.error('Errore nel salvare le impostazioni:', error);
    }
  }

  getSettings(): AppSettings {
    return { ...this.settings };
  }

  getOutputPath(): string {
    return this.settings.outputPath;
  }

  getLanguage(): string {
    return this.settings.language;
  }

  getTheme(): string {
    return this.settings.theme;
  }

  getSidePanelCollapsed(): boolean {
    return this.settings.sidePanelCollapsed;
  }

  updateSettings(newSettings: Partial<AppSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  updateOutputPath(outputPath: string): void {
    this.settings.outputPath = outputPath;
    this.saveSettings();
  }

  updateLanguage(language: string): void {
    this.settings.language = language;
    this.saveSettings();
  }

  updateTheme(theme: string): void {
    this.settings.theme = theme;
    this.saveSettings();
  }

  updateSidePanelCollapsed(collapsed: boolean): void {
    this.settings.sidePanelCollapsed = collapsed;
    this.saveSettings();
  }

  // Get the effective output path (custom or default)
  getEffectiveOutputPath(): string {
    if (this.settings.outputPath && this.settings.outputPath.trim() !== '') {
      return this.settings.outputPath;
    }
    
    // Default path: Desktop/Toolsy Conversions
    const desktopDir = app.getPath('desktop');
    return path.join(desktopDir, 'Toolsy Conversions');
  }
}

export const settingsManager = new SettingsManager();
export type { AppSettings };
