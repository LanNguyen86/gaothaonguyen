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
import {
  isSupabaseConfigured,
  dbGetProducts,
  dbUpsertProduct,
  dbDeleteProduct,
  dbGetStoreSettings,
  dbSaveStoreSetting,
} from '../lib/supabase';

const STORAGE_KEY = 'thao_nguyen_cms_data_v2';

const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('data:image/')) return true;
  if (trimmed.startsWith('/') && trimmed.length > 2) return true;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.length > 15 && !trimmed.includes('undefined');
  }
  return false;
};

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
        if (!storeInfoMerged.heroBgUrl) storeInfoMerged.heroBgUrl = INITIAL_STORE_INFO.heroBgUrl;
        if (!storeInfoMerged.heroCookedBowlUrl) storeInfoMerged.heroCookedBowlUrl = INITIAL_STORE_INFO.heroCookedBowlUrl;
        if (!storeInfoMerged.spotlightSt25BagUrl) storeInfoMerged.spotlightSt25BagUrl = INITIAL_STORE_INFO.spotlightSt25BagUrl;
        if (!storeInfoMerged.ownerAvatarUrl) storeInfoMerged.ownerAvatarUrl = INITIAL_STORE_INFO.ownerAvatarUrl;

        const productsMerged = Array.isArray(parsed.products) && parsed.products.length > 0
          ? parsed.products.map((p) => {
              const fallbackP = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
              const isImgValid = isValidImageUrl(p.imageUrl);
              return {
                ...p,
                imageUrl: isImgValid ? p.imageUrl : (fallbackP?.imageUrl || '/logo.png'),
              };
            })
          : INITIAL_PRODUCTS;

        return {
          storeInfo: storeInfoMerged,
          heroContent: { ...INITIAL_HERO_CONTENT, ...parsed.heroContent },
          trustBadges: parsed.trustBadges || INITIAL_TRUST_BADGES,
          spotlightST25: { ...INITIAL_SPOTLIGHT_ST25, ...parsed.spotlightST25 },
          products: productsMerged,
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

  // Save to localStorage whenever data changes (local cache)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save CMS data to localStorage:', e);
    }
  }, [data]);

  // Sync from Supabase Cloud on mount if credentials exist
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    async function syncCloudData() {
      try {
        const [prodRes, settingsRes] = await Promise.all([
          dbGetProducts(),
          dbGetStoreSettings(),
        ]);

        if (prodRes.success && Array.isArray(prodRes.data) && prodRes.data.length > 0) {
          const mappedProducts = prodRes.data.map((p) => {
            const fallbackP = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
            const rawImg = p.image_url || p.imageUrl;
            const isImgValid = isValidImageUrl(rawImg);
            return {
              ...p,
              desc: p.desc_text || p.desc || fallbackP?.desc || '',
              imageUrl: isImgValid ? rawImg : (fallbackP?.imageUrl || '/logo.png'),
              packagingSnippet: p.packaging_snippet || p.packagingSnippet || fallbackP?.packagingSnippet || '',
              textureBadge: p.texture_badge || p.textureBadge || fallbackP?.textureBadge || '',
              badgeType: p.badge_type || p.badgeType || fallbackP?.badgeType || 'default',
              waterRatio: p.water_ratio || p.waterRatio || fallbackP?.waterRatio || '',
              suitableFor: p.suitable_for || p.suitableFor || fallbackP?.suitableFor || '',
            };
          });
          setData((prev) => ({ ...prev, products: mappedProducts }));
        }

        if (settingsRes.success && settingsRes.data) {
          setData((prev) => {
            const cloudStoreInfo = settingsRes.data.storeInfo || {};
            const mergedStoreInfo = {
              ...INITIAL_STORE_INFO,
              ...prev.storeInfo,
              ...cloudStoreInfo,
              // Always guarantee essential imagery
              heroBgUrl: cloudStoreInfo.heroBgUrl || prev.storeInfo?.heroBgUrl || INITIAL_STORE_INFO.heroBgUrl,
              heroCookedBowlUrl: cloudStoreInfo.heroCookedBowlUrl || prev.storeInfo?.heroCookedBowlUrl || INITIAL_STORE_INFO.heroCookedBowlUrl,
              spotlightSt25BagUrl: cloudStoreInfo.spotlightSt25BagUrl || prev.storeInfo?.spotlightSt25BagUrl || INITIAL_STORE_INFO.spotlightSt25BagUrl,
              ownerAvatarUrl: cloudStoreInfo.ownerAvatarUrl || prev.storeInfo?.ownerAvatarUrl || INITIAL_STORE_INFO.ownerAvatarUrl,
              logoUrl: cloudStoreInfo.logoUrl || prev.storeInfo?.logoUrl || '/logo.png',
            };

            const mergedHero = {
              ...INITIAL_HERO_CONTENT,
              ...prev.heroContent,
              ...(settingsRes.data.heroContent || {}),
            };

            const mergedSpotlight = {
              ...INITIAL_SPOTLIGHT_ST25,
              ...prev.spotlightST25,
              ...(settingsRes.data.spotlightST25 || {}),
            };

            const mergedTrust = settingsRes.data.trustBadges || prev.trustBadges || INITIAL_TRUST_BADGES;
            const mergedCalc = {
              ...INITIAL_CALCULATOR_CONFIG,
              ...prev.calculatorConfig,
              ...(settingsRes.data.calculatorConfig || {}),
            };
            const mergedB2B = {
              ...INITIAL_B2B_CONTENT,
              ...prev.b2bContent,
              ...(settingsRes.data.b2bContent || {}),
            };
            const mergedWarehouse = {
              ...INITIAL_WAREHOUSE_CONTENT,
              ...prev.warehouseContent,
              ...(settingsRes.data.warehouseContent || {}),
              googleMapsEmbed: INITIAL_WAREHOUSE_CONTENT.googleMapsEmbed,
              address: INITIAL_WAREHOUSE_CONTENT.address,
            };

            return {
              ...prev,
              storeInfo: mergedStoreInfo,
              heroContent: mergedHero,
              spotlightST25: mergedSpotlight,
              trustBadges: mergedTrust,
              calculatorConfig: mergedCalc,
              b2bContent: mergedB2B,
              warehouseContent: mergedWarehouse,
            };
          });
        }
      } catch (err) {
        console.warn('Supabase initial sync error:', err);
      }
    }

    syncCloudData();
  }, []);

  // Section update handlers with optional cloud sync
  const updateStoreInfo = (fields) => {
    setData((prev) => {
      const merged = { ...prev.storeInfo, ...fields };
      if (isSupabaseConfigured()) {
        dbSaveStoreSetting('storeInfo', merged);
      }
      return { ...prev, storeInfo: merged };
    });
  };

  const updateHeroContent = (fields) => {
    setData((prev) => {
      const merged = { ...prev.heroContent, ...fields };
      if (isSupabaseConfigured()) {
        dbSaveStoreSetting('heroContent', merged);
      }
      return { ...prev, heroContent: merged };
    });
  };

  const updateTrustBadges = (newBadges) => {
    setData((prev) => {
      if (isSupabaseConfigured()) {
        dbSaveStoreSetting('trustBadges', newBadges);
      }
      return { ...prev, trustBadges: newBadges };
    });
  };

  const updateSpotlightST25 = (fields) => {
    setData((prev) => {
      const merged = { ...prev.spotlightST25, ...fields };
      if (isSupabaseConfigured()) {
        dbSaveStoreSetting('spotlightST25', merged);
      }
      return { ...prev, spotlightST25: merged };
    });
  };

  const updateProduct = (id, fields) => {
    setData((prev) => {
      const updatedList = prev.products.map((p) => (p.id === id ? { ...p, ...fields } : p));
      const target = updatedList.find((p) => p.id === id);
      if (target && isSupabaseConfigured()) {
        dbUpsertProduct({
          id: target.id,
          name: target.name,
          price: target.price,
          category: target.category,
          badge: target.badge,
          badge_type: target.badgeType,
          packaging_snippet: target.packagingSnippet,
          texture_badge: target.textureBadge,
          desc_text: target.desc,
          image_url: target.imageUrl,
          origin: target.origin,
          texture: target.texture,
          water_ratio: target.waterRatio,
          suitable_for: target.suitableFor,
        });
      }
      return { ...prev, products: updatedList };
    });
  };

  const updateProductPrice = (id, newPrice) => {
    updateProduct(id, { price: Number(newPrice) || 0 });
  };

  const addProduct = (newProduct) => {
    const id = newProduct.id || `rice-${Date.now()}`;
    const productObj = {
      ...newProduct,
      id,
      price: Number(newProduct.price) || 20000,
      category: newProduct.category || ['family'],
      imageUrl: newProduct.imageUrl || '/logo.png',
    };
    if (isSupabaseConfigured()) {
      dbUpsertProduct({
        id: productObj.id,
        name: productObj.name,
        price: productObj.price,
        category: productObj.category,
        badge: productObj.badge,
        badge_type: productObj.badgeType,
        packaging_snippet: productObj.packagingSnippet,
        texture_badge: productObj.textureBadge,
        desc_text: productObj.desc,
        image_url: productObj.imageUrl,
        origin: productObj.origin,
        texture: productObj.texture,
        water_ratio: productObj.waterRatio,
        suitable_for: productObj.suitableFor,
      });
    }
    setData((prev) => ({
      ...prev,
      products: [productObj, ...prev.products],
    }));
  };

  const deleteProduct = (id) => {
    if (isSupabaseConfigured()) {
      dbDeleteProduct(id);
    }
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