// app/api/login/route.js
import { supabase } from "../../../../lib/supabase";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Attempt login with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if a session is returned and send the access token
    if (data?.session) {
      const { access_token } = data.session; // Get the access token from the session
      return new Response(
        JSON.stringify({ access_token }), 
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Session data is missing" }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

  } catch (error) {
    console.error("Error during login:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
