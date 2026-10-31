import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from Vite environment variables (or fallbacks)
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://cocswqyvmhcblocbxvpg.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_iU4DNqjT3RZ7WxVMELsBXg_HHd2JNmJ';

/**
 * Checks if Supabase has been configured with valid credentials
 */
export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// ==========================================
// Database Helpers for Products
// ==========================================

export async function dbGetProducts() {
  if (!isSupabaseConfigured() || !supabase) return { success: false, data: null };
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase fetch products error:', err);
    return { success: false, error: err.message };
  }
}

export async function dbUpsertProduct(product) {
  if (!isSupabaseConfigured() || !supabase) return { success: false };
  try {
    const { data, error } = await supabase
      .from('products')
      .upsert(product)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Supabase upsert product error:', err);
    return { success: false, error: err.message };
  }
}

export async function dbDeleteProduct(productId) {
  if (!isSupabaseConfigured() || !supabase) return { success: false };
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Supabase delete product error:', err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// Database Helpers for Orders
// ==========================================

export async function dbGetOrders() {
  if (!isSupabaseConfigured() || !supabase) {
    // Fallback to local storage orders if Supabase is not configured yet
    try {
      const local = localStorage.getItem('thao_nguyen_local_orders');
      return { success: true, data: local ? JSON.parse(local) : [] };
    } catch {
      return { success: true, data: [] };
    }
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (err) {
    console.warn('Supabase fetch orders error:', err);
    return { success: false, error: err.message, data: [] };
  }
}

export async function dbCreateOrder(orderData) {
  const newOrder = {
    ...orderData,
    created_at: new Date().toISOString(),
    status: orderData.status || 'pending',
  };

  // Always save a local copy as backup
  try {
    const saved = localStorage.getItem('thao_nguyen_local_orders');
    const list = saved ? JSON.parse(saved) : [];
    list.unshift({ ...newOrder, id: newOrder.id || 'local_' + Date.now() });
    localStorage.setItem('thao_nguyen_local_orders', JSON.stringify(list));
  } catch (e) {
    console.warn('Error saving local order copy:', e);
  }

  if (!isSupabaseConfigured() || !supabase) {
    return { success: true, data: newOrder, isLocal: true };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] };
  } catch (err) {
    console.error('Supabase create order error:', err);
    return { success: false, error: err.message };
  }
}

export async function dbUpdateOrderStatus(orderId, status) {
  // Update local storage copy
  try {
    const saved = localStorage.getItem('thao_nguyen_local_orders');
    if (saved) {
      const list = JSON.parse(saved).map(o => o.id === orderId ? { ...o, status } : o);
      localStorage.setItem('thao_nguyen_local_orders', JSON.stringify(list));
    }
  } catch (e) {
    console.warn(e);
  }

  if (!isSupabaseConfigured() || !supabase) return { success: true };

  try {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Supabase update order status error:', err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// Database Helpers for Store Settings
// ==========================================

export async function dbGetStoreSettings() {
  if (!isSupabaseConfigured() || !supabase) return { success: false, data: null };
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*');

    if (error) throw error;
    
    // Map array of rows [{ key: 'storeInfo', content: {...} }] to single object
    const settingsMap = {};
    if (Array.isArray(data)) {
      data.forEach((row) => {
        settingsMap[row.key] = row.content;
      });
    }
    return { success: true, data: settingsMap };
  } catch (err) {
    console.warn('Supabase fetch store settings error:', err);
    return { success: false, error: err.message };
  }
}

export async function dbSaveStoreSetting(key, content) {
  if (!isSupabaseConfigured() || !supabase) return { success: false };
  try {
    const { error } = await supabase
      .from('store_settings')
      .upsert({
        key,
        content,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error(`Supabase save setting (${key}) error:`, err);
    return { success: false, error: err.message };
  }
}
