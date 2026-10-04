import type { ComponentType } from 'react';
import type { IconName } from 'nekkora-lib';
import { GettingStarted } from './GettingStarted';
import { Themes } from './Themes';
import {
  AppPage,
  AuthPage,
  BadgePage,
  CheckboxPage,
  FeedbackPage,
  BlocksPage,
  ButtonPage,
  CardPage,
  FieldsetPage,
  IconBoxPage,
  LogoPage,
  IconsPage,
  InputPage,
  LayoutPage,
  LinkPage,
  MasksPage,
  SelectPage,
  TablePage,
  TypographyPage,
} from './Components';

export interface DocPage {
  id: string;
  title: string;
  group: string;
  icon: IconName;
  Component: ComponentType;
}

export const pages: DocPage[] = [
  { id: 'inicio', title: 'Introdução', group: 'Começando', icon: 'home', Component: GettingStarted },
  { id: 'temas', title: 'Temas', group: 'Começando', icon: 'sakura', Component: Themes },
  { id: 'logo', title: 'Logo', group: 'Fundamentos', icon: 'eye', Component: LogoPage },
  { id: 'tipografia', title: 'Tipografia', group: 'Fundamentos', icon: 'file', Component: TypographyPage },
  { id: 'icones', title: 'Ícones', group: 'Fundamentos', icon: 'star', Component: IconsPage },
  { id: 'iconbox', title: 'IconBox', group: 'Fundamentos', icon: 'box', Component: IconBoxPage },
  { id: 'button', title: 'Button', group: 'Ações', icon: 'box', Component: ButtonPage },
  { id: 'link', title: 'Link', group: 'Ações', icon: 'link', Component: LinkPage },
  { id: 'badge', title: 'Badge', group: 'Ações', icon: 'check-circle', Component: BadgePage },
  { id: 'input', title: 'Input', group: 'Formulários', icon: 'edit', Component: InputPage },
  { id: 'mascaras', title: 'Máscaras', group: 'Formulários', icon: 'id-card', Component: MasksPage },
  { id: 'select', title: 'Select & Options', group: 'Formulários', icon: 'chevron-down', Component: SelectPage },
  { id: 'fieldset', title: 'Fieldset', group: 'Formulários', icon: 'workspace', Component: FieldsetPage },
  { id: 'layout', title: 'Container & Layout', group: 'Layout', icon: 'layers', Component: LayoutPage },
  { id: 'card', title: 'Card', group: 'Layout', icon: 'monitor', Component: CardPage },
  { id: 'blocos', title: 'Blocos de página', group: 'Layout', icon: 'layers', Component: BlocksPage },
  { id: 'checkbox', title: 'Checkbox & CodeInput', group: 'Formulários', icon: 'check-circle', Component: CheckboxPage },
  { id: 'tabelas', title: 'Tabelas', group: 'Dados', icon: 'chart', Component: TablePage },
  { id: 'feedback', title: 'Feedback', group: 'Feedback', icon: 'alert', Component: FeedbackPage },
  { id: 'auth', title: 'AuthLayout & QrCode', group: 'Autenticação', icon: 'lock', Component: AuthPage },
  { id: 'aplicacao', title: 'AppShell, LoadMore & DescriptionList', group: 'Aplicação', icon: 'layers', Component: AppPage },
];
