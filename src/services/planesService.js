import { supabase } from "../supabaseClient.js";

export const PlanesService = {

    getAll: async () => {
        return await supabase.from('cuentas').select('*').eq('activo', true).order("id_cuenta", { ascending: false });
    },
    add: async (cuenta) => {
        return await supabase.from("cuentas").insert([cuenta]).select();
    },
    update: async (id_cuenta, updates) => {
        return await supabase.from("cuentas").update(updates).eq("id_cuenta", id_cuenta).select();
    },
    softDelete: async (id_cuenta) => {
        return await supabase.from("cuentas").update({ estado: false }).eq("id_cuenta", id_cuenta).select();
    }


}