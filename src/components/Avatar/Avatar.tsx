import { forwardRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import './Avatar.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Nome da pessoa: é o nome acessível e a origem das iniciais. */
  name: string;
  /** Foto. Sem foto, ou se ela falhar ao carregar, aparecem as iniciais. */
  src?: string;
  /** Iniciais a mostrar (padrão: primeira letra do primeiro e do último nome). */
  initials?: string;
  size?: AvatarSize;
}

/** Iniciais de um nome: primeira letra do primeiro e do último nome ("Ana Paula Souza" → "AS"; "Ana" → "A"). */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const first = [...words[0]][0];
  const last = words.length > 1 ? [...words[words.length - 1]][0] : '';
  return (first + last).toLocaleUpperCase();
}

/**
 * Círculo com a foto da pessoa ou, sem foto, com as iniciais do nome.
 * É uma imagem com o nome como texto alternativo; dentro de um botão já rotulado, passe `aria-hidden`.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, initials, size = 'md', className, ...rest },
  ref,
) {
  // guarda QUAL foto falhou: trocar o `src` tenta de novo
  const [failedSrc, setFailedSrc] = useState<string>();
  const showPhoto = src != null && src !== '' && failedSrc !== src;
  const hidden = rest['aria-hidden'] === true || rest['aria-hidden'] === 'true';

  return (
    <span
      ref={ref}
      role={hidden ? undefined : 'img'}
      aria-label={hidden ? undefined : name}
      className={cx('nk-avatar', `nk-avatar--${size}`, className)}
      {...rest}
    >
      {showPhoto ? (
        <img className="nk-avatar__img" src={src} alt="" onError={() => setFailedSrc(src)} />
      ) : (
        <span className="nk-avatar__initials" aria-hidden="true">
          {initials ?? getInitials(name)}
        </span>
      )}
    </span>
  );
});
