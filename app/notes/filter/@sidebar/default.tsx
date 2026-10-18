// src/app/notes/filter/@sidebar/default.tsx
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import css from './SidebarNotes.module.css';

export default function SidebarNotes() {
  const params = useParams();

  const currentTag = params?.tag as string;

  const tags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

  return (
    <ul className={css.menuList}>
      {}
      <li className={css.menuItem}>
        <Link
          href="/notes/filter/all"
          className={`${css.menuLink} ${currentTag === 'all' ? css.activeLink : ''}`}
        >
          All notes
        </Link>
      </li>

      {}
      {tags.map(tag => (
        <li key={tag} className={css.menuItem}>
          <Link
            href={`/notes/filter/${tag}`}
            className={`${css.menuLink} ${currentTag === tag ? css.activeLink : ''}`}
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
