import { supabase } from "../backend/supabaseClient.js";

export const ClientesService = { 
    getAll: async () => {
        return await supabase.from('clientes').select('*').eq('activo', true).order("id", { ascending: false });
    },
    add: async (cliente) => {
    return await supabase.from("clientes").insert([cliente]).select();
  },
  update: async (id, updates) => {
    return await supabase.from("clientes").update(updates).eq("id_cliente", id).select();
  },
  softDelete: async (id) => {
    return await supabase.from("clientes").update({ activo: false }).eq("id_cliente", id).select();
  }
}