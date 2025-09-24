import { supabase } from "../supabaseClient.js";

export const CategoriasService = {

    getAll: async () => {
        return await supabase.from('categorias').select('*').eq('estado', true).order("id_categoria", { ascending: false });
    },
    add: async (plan) => {
        return await supabase.from("categorias").insert([categorias]).select();
    },
    update: async (id, updates) => {
        return await supabase.from("categorias").update(updates).eq("id_categoria", id_categoria).select();
    },
    softDelete: async (id) => {
        return await supabase.from("categorias").update({ estado: false }).eq("id_categoria", id_categoria).select();
    }


}