import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  STORE_INFO as INITIAL_STORE_INFO,
  HERO_CONTENT as INITIAL_HERO_CONTENT,
  TRUST_BADGES as INITIAL_TRUST_BADGES,
  SPOTLIGHT_ST25 as INITIAL_SPOTLIGHT_ST25,
  RICE_13_PRODUCTS as INITIAL_PRODUCTS,
  CALCULATOR_CONFIG as INITIAL_CALCULATOR_CONFIG,
  B2B_CONTENT as INITIAL_B2B_CONTENT,
  WAREHOUSE_CONTENT as INITIAL_WAREHOUSE_CONTENT,
} from '../data/riceData';

const STORAGE_KEY = 'thao_nguyen_cms_data_v2';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  // Load initial data from localStorage if available, otherwise use initial defaults
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('thao_nguyen_cms_data_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        const warehouseMerged = { ...INITIAL_WAREHOUSE_CONTENT, ...parsed.warehouseContent };
        // Ensure accurate official Google Maps embed for 586 Hà Huy Giáp
        if (!warehouseMerged.googleMapsEmbed || !warehouseMerged.googleMapsEmbed.includes('0x317528e12d8a571f')) {
          warehouseMerged.googleMapsEmbed = INITIAL_WAREHOUSE_CONTENT.googleMapsEmbed;
          warehouseMerged.address = INITIAL_WAREHOUSE_CONTENT.address;
        }

        const storeInfoMerged = { ...INITIAL_STORE_INFO, ...parsed.storeInfo };
        storeInfoMerged.address = INITIAL_STORE_INFO.address;
        storeInfoMerged.googleMapsUrl = INITIAL_STORE_INFO.googleMapsUrl;
        if (!storeInfoMerged.logoUrl || storeInfoMerged.logoUrl.includes('googleusercontent')) {
          storeInfoMerged.logoUrl = '/logo.png';
        }

        return {
          storeInfo: storeInfoMerged,
          heroContent: { ...INITIAL_HERO_CONTENT, ...parsed.heroContent },
          trustBadges: parsed.trustBadges || INITIAL_TRUST_BADGES,
          spotlightST25: { ...INITIAL_SPOTLIGHT_ST25, ...parsed.spotlightST25 },
          products: parsed.products || INITIAL_PRODUCTS,
          calculatorConfig: { ...INITIAL_CALCULATOR_CONFIG, ...parsed.calculatorConfig },
          b2bContent: { ...INITIAL_B2B_CONTENT, ...parsed.b2bContent },
          warehouseContent: warehouseMerged,
        };
      }
    } catch (e) {
      console.warn('Failed to parse saved CMS data from localStorage:', e);
    }
    return {
      storeInfo: INITIAL_STORE_INFO,
      heroContent: INITIAL_HERO_CONTENT,
      trustBadges: INITIAL_TRUST_BADGES,
      spotlightST25: INITIAL_SPOTLIGHT_ST25,
      products: INITIAL_PRODUCTS,
      calculatorConfig: INITIAL_CALCULATOR_CONFIG,
      b2bContent: INITIAL_B2B_CONTENT,
      warehouseContent: INITIAL_WAREHOUSE_CONTENT,
    };
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save CMS data to localStorage:', e);
    }
  }, [data]);

  // Section update handlers
  const updateStoreInfo = (fields) => {
    setData((prev) => ({
      ...prev,
      storeInfo: { ...prev.storeInfo, ...fields },
    }));
  };

  const updateHeroContent = (fields) => {
    setData((prev) => ({
      ...prev,
      heroContent: { ...prev.heroContent, ...fields },
    }));
  };

  const updateTrustBadges = (newBadges) => {
    setData((prev) => ({
      ...prev,
      trustBadges: newBadges,
    }));
  };

  const updateSpotlightST25 = (fields) => {
    setData((prev) => ({
      ...prev,
      spotlightST25: { ...prev.spotlightST25, ...fields },
    }));
  };

  const updateProduct = (id, fields) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, ...fields } : p)),
    }));
  };

  const updateProductPrice = (id, newPrice) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, price: Number(newPrice) || 0 } : p
      ),
    }));
  };

  const addProduct = (newProduct) => {
    const id = newProduct.id || `rice-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      products: [
        {
          ...newProduct,
          id,
          price: Number(newProduct.price) || 20000,
          category: newProduct.category || ['family'],
          imageUrl: newProduct.imageUrl || '/logo.png',
        },
        ...prev.products,
      ],
    }));
  };

  const deleteProduct = (id) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
  };

  const updateAllProducts = (productsList) => {
    setData((prev) => ({
      ...prev,
      products: productsList,
    }));
  };

  const updateCalculatorConfig = (fields) => {
    setData((prev) => ({
      ...prev,
      calculatorConfig: { ...prev.calculatorConfig, ...fields },
    }));
  };

  const updateB2BContent = (fields) => {
    setData((prev) => ({
      ...prev,
      b2bContent: { ...prev.b2bContent, ...fields },
    }));
  };

  const updateWarehouseContent = (fields) => {
    setData((prev) => ({
      ...prev,
      warehouseContent: { ...prev.warehouseContent, ...fields },
    }));
  };

  // Reset to original defaults
  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData({
      storeInfo: INITIAL_STORE_INFO,
      heroContent: INITIAL_HERO_CONTENT,
      trustBadges: INITIAL_TRUST_BADGES,
      spotlightST25: INITIAL_SPOTLIGHT_ST25,
      products: INITIAL_PRODUCTS,
      calculatorConfig: INITIAL_CALCULATOR_CONFIG,
      b2bContent: INITIAL_B2B_CONTENT,
      warehouseContent: INITIAL_WAREHOUSE_CONTENT,
    });
  };

  // Export CMS backup JSON
  const exportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `vua_gao_thao_nguyen_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import CMS backup JSON
  const importData = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      setData((prev) => ({
        ...prev,
        ...parsed,
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    ...data,
    updateStoreInfo,
    updateHeroContent,
    updateTrustBadges,
    updateSpotlightST25,
    updateProduct,
    updateProductPrice,
    addProduct,
    deleteProduct,
    updateAllProducts,
    updateCalculatorConfig,
    updateB2BContent,
    updateWarehouseContent,
    resetToDefault,
    exportData,
    importData,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}