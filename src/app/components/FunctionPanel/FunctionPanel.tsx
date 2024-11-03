import React, { useState } from 'react';

import { GameAsset } from '@/app/util/structs';
import LineChart from './LineChart';
import styles from './FunctionPanel.module.css';

interface FunctionPanelProps {
  chart_refresh: number;
  assets: GameAsset[];
}

const FunctionPanel: React.FC<FunctionPanelProps> = ({ chart_refresh, assets }) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['RTK', 'FDP', 'PHR']);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    commodities: false,
    stocks: false,
    crypto: false,
  });
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleCheckboxChange = (symbol: string) => {
    setSelectedAssets((prevSelected) => {
      if (prevSelected.includes(symbol)) {
        // If already selected, remove it
        return prevSelected.filter((s) => s !== symbol);
      } else {
        // If not selected and less than 3, add it
        if (prevSelected.length < 3) {
          return [...prevSelected, symbol];
        }
        // If already 3 selected, do nothing
        return prevSelected;
      }
    });
  };

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const groupedAssets: Record<string, GameAsset[]> = {
    commodities: assets.filter((asset) => asset.category === 'commodity'),
    stocks: assets.filter((asset) => asset.category === 'stock'),
    crypto: assets.filter((asset) => asset.category === 'crypto'),
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.chart} ${menuOpen ? styles.chartExpanded : styles.chartCollapsed}`}>
        <LineChart chart_refresh={chart_refresh} assets={assets} selectedAssets={selectedAssets} />
      </div>
      <div className={`${styles.toggle} ${menuOpen ? styles.menuOpen : styles.menuClosed}`}>
        <div className={styles.iconContainer} onClick={toggleMenu}>
          {menuOpen ? '→' : '←'} {/* Replace with your icon */}
        </div>
        {menuOpen && (
          <div className={styles.menuContent}>
            {Object.keys(groupedAssets).map((type) => {
              const selected = groupedAssets[type].filter((asset) => selectedAssets.includes(asset.symbol));
              const unselected = groupedAssets[type].filter((asset) => !selectedAssets.includes(asset.symbol));

              return (
                <div key={type}>
                  <h3 onClick={() => toggleCategory(type)} className={styles.categoryHeader}>
                    {type.charAt(0).toUpperCase() + type.slice(1)} {openCategories[type] ? '▼' : '▲'}
                  </h3>
                  {openCategories[type] && (
                    <div className={styles.categoryContent}>
                      {[...selected, ...unselected].map((asset) => (
                        <div key={asset.symbol} className={styles.assetRow}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={selectedAssets.includes(asset.symbol)}
                              onChange={() => handleCheckboxChange(asset.symbol)}
                            />
                            <span className={styles.assetSymbol}>{asset.symbol}</span>
                            <span className={styles.assetName}>{asset.name}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionPanel;
