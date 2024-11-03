'use client';

import { AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from 'react';

import { GameAsset } from '@/app/util/structs';
import style from './AssetCategory.module.css';

export default function AssetCategory(props: { assets: GameAsset[]; category: string; label: string }) {
  const [active, setActive] = useState(false);

  return (
    <div className={`${style.category} ${active ? style.active : ''}`} onClick={() => setActive(!active)}>
      <i className={`bi bi-${active ? 'dash' : 'plus'}-lg`}></i>
      <span>{props.label}</span>
    </div>
  );
}
