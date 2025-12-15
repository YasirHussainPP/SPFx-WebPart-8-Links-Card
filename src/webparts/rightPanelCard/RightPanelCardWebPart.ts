import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { PropertyFieldPeoplePicker, PrincipalType } from '@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker';
import * as React from 'react';
import * as ReactDom from 'react-dom';


import { IReadonlyTheme } from '@microsoft/sp-component-base';
import AcePanelCard from './components/RightPanelCard';
import { IAcePanelCardProps } from './components/IRightPanelCardProps';

// PnP Property Controls
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';

export interface IAcePanelCardWebPartProps extends IAcePanelCardProps {}

export default class AcePanelCardWebPart extends BaseClientSideWebPart<IAcePanelCardWebPartProps> {
  private _isDarkTheme = false;
  private _theme: IReadonlyTheme | undefined;

  public render(): void {
    this._applyThemeAsCssVars();

    
const element: React.ReactElement<IAcePanelCardProps> = React.createElement(AcePanelCard, {
  cardSize: this.properties.cardSize || 'large',
  title: this.properties.title || '',
  description: this.properties.description || '',
  iconUrl: this.properties.iconUrl || '',
  rightImageUrl: this.properties.rightImageUrl || '',
  viewMoreLabel: this.properties.viewMoreLabel || 'View more',
  panelActions: this.properties.panelActions || [],
  audience: this.properties.audience || [],
  isDarkTheme: this._isDarkTheme,
  context: this.context // ✅ Pass WebPartContext
});


    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void { ReactDom.unmountComponentAtNode(this.domElement); }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    this._theme = currentTheme;
    this._isDarkTheme = !!currentTheme?.isInverted;
    this._applyThemeAsCssVars();
  }

  private _applyThemeAsCssVars(): void {
    const root = this.domElement as HTMLElement;
    const t = this._theme;
    const palette = t?.palette;
    const semantic = t?.semanticColors;

    root.style.setProperty('--card-bg', semantic?.bodyBackground ?? (this._isDarkTheme ? '#1f1f1f' : '#ffffff'));
    root.style.setProperty('--card-border', semantic?.variantBorder ?? (this._isDarkTheme ? '#3a3a3a' : '#e1e1e1'));
    root.style.setProperty('--focus', semantic?.focusBorder ?? (this._isDarkTheme ? '#5aa6ff' : '#0078d4'));
    root.style.setProperty('--text', semantic?.bodyText ?? (this._isDarkTheme ? '#f1f1f1' : '#111111'));
    root.style.setProperty('--text-subtle', semantic?.bodySubtext ?? (this._isDarkTheme ? '#c8c8c8' : '#616161'));
    root.style.setProperty('--brand', palette?.themePrimary ?? '#0078d4');

    // Stronger multi-layer shadows (dark)
    if (this._isDarkTheme) {
      root.style.setProperty('--shadow-layer-1', '0 1px 2px rgba(0,0,0,0.70)');
      root.style.setProperty('--shadow-layer-2', '0 8px 24px rgba(0,0,0,0.55)');
      root.style.setProperty('--shadow-layer-3', '0 16px 48px rgba(0,0,0,0.45)');
    } else {
      root.style.setProperty('--shadow-layer-1', '0 1px 2px rgba(0,0,0,0.06)');
      root.style.setProperty('--shadow-layer-2', '0 8px 24px rgba(0,0,0,0.10)');
      root.style.setProperty('--shadow-layer-3', '0 16px 48px rgba(0,0,0,0.10)');
    }
  }

  protected get dataVersion(): Version { return Version.parse('1.0'); }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [{
        header: { description: '' },
        groups: [
          {
            groupName: 'Card',
            groupFields: [
              PropertyPaneDropdown('cardSize', {
                label: 'Size',
                options: [
                  { key: 'large', text: 'Large' },
                  { key: 'medium', text: 'Medium' }
                ]
              }),
              PropertyPaneTextField('title', { label: 'Title' }),
              PropertyPaneTextField('description', { label: 'Description', multiline: true }),
              PropertyPaneTextField('iconUrl', { label: 'Card Icon URL' }),
              PropertyPaneTextField('rightImageUrl', { label: 'Thumbnail Image URL' }),
              PropertyPaneTextField('viewMoreLabel', { label: 'Button Text' })
            ]
          },
          {
            groupName: 'Right panel',
            groupFields: [
              PropertyPaneTextField('panelTitle', { label: 'Panel title' }),
              PropertyPaneTextField('panelSubText', { label: 'Panel subtext', multiline: true }),
              PropertyFieldPeoplePicker('audience', {
                label: 'Audience Targeting',
                initialData: this.properties.audience,
                allowDuplicate: false,
                principalType: [PrincipalType.Users, PrincipalType.Security], // Users and Security Groups
                onPropertyChange: this.onPropertyPaneFieldChanged,
                context: this.context,
                properties: this.properties,
                key: 'peopleFieldId'
              }),
              PropertyFieldCollectionData('panelActions', {
                key: 'panelActions',
                label: 'Right panel buttons',
                panelHeader: 'Configure panel buttons',
                manageBtnLabel: 'Manage',
                value: this.properties.panelActions,
                enableSorting: true,
                fields: [
                  { id: 'label', title: 'Label', type: CustomCollectionFieldType.string, required: true },
                  { id: 'iconName', title: 'Icon (Fluent UI)', type: CustomCollectionFieldType.string },
                  { id: 'url', title: 'URL', type: CustomCollectionFieldType.url, required: true },
                  { id: 'openInNewTab', title: 'Open in new tab', type: CustomCollectionFieldType.boolean }
                ]
              })
            ]
          }
        ]
      }]
    };
  }
}