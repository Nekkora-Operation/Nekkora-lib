import type { ReactNode } from 'react';
import { Icon, type IconName } from '../components/Icon';

/** Aceita o nome de um ícone Nekkora ou qualquer ReactNode (ex.: SVG próprio). */
export type IconProp = IconName | ReactNode;

export function renderIcon(icon: IconProp, size: number) {
  return typeof icon === 'string' ? <Icon name={icon as IconName} size={size} /> : icon;
}
