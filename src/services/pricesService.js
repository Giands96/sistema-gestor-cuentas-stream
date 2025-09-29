import { supabase } from "../supabaseClient.js";

export const PricesService = {

    getAll: async () => {
        return await supabase.from('precios').select('*').order("id_app", { ascending: false });
    },
    add: async (precio) => {
        return await supabase.from("precios").insert([precio]).select();
    },
    update: async (id, updates) => {
        return await supabase.from("precios").update(updates).eq("id", id).select();
    },


    
}