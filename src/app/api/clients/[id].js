// /pages/api/clients/[id].js

import { createClient } from '@supabase/supabase-js';

import { supabase } from '../../../../lib/supabase';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Fetch the client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select(`
        id,
        name,
        email,
        created_at,
        programs ( id, name )
      `)
      .eq('id', id)
      .single();

    if (clientError) {
      console.error(clientError);
      return res.status(404).json({ message: 'Client not found' });
    }

    return res.status(200).json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
