import { WebPartContext } from '@microsoft/sp-webpart-base';

export type PanelAction = {
  label: string;
  iconName?: string;      
  url: string;
  openInNewTab?: boolean;  
};

export interface IAcePanelCardProps {
  cardSize: 'large' | 'medium';
  title: string;
  description: string;
  iconUrl: string;
  rightImageUrl: string;
  viewMoreLabel: string;
  panelActions: PanelAction[];
  audience?: any[];
  context:WebPartContext;
  isDarkTheme?: boolean;
}
