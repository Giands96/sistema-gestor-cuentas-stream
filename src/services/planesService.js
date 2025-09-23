import { supabase } from "../supabaseClient.js";

export const PlanesService = {

    getAll: async () => {
        return await supabase.from('planes').select('*').eq('estado', true).order("id", { ascending: false });
    },
    add: async (plan) => {
        return await supabase.from("planes").insert([plan]).select();
    },
    update: async (id, updates) => {
        return await supabase.from("planes").update(updates).eq("id", id).select();
    },
    softDelete: async (id) => {
        return await supabase.from("planes").update({ estado: false }).eq("id", id).select();
    }


}