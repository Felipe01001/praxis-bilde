import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BillingRequest {
  user_id: string;
  user_data: {
    name: string;
    email: string;
    cpf: string;
  };
  amount: number;
  description: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { user_id, user_data, amount, description }: BillingRequest = await req.json();
    
    console.log('Creating AbacatePay billing for user:', user_id);

    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Prepare AbacatePay billing data
    const billingData = {
      frequency: "MONTHLY",
      methods: ["PIX"],
      customer: {
        name: user_data.name,
        email: user_data.email,
        taxId: user_data.cpf,
        cellphone: ""
      },
      products: [{
        externalId: `praxis-monthly-${user_id}`,
        name: "PRAXIS - Assinatura Mensal",
        description: description,
        quantity: 1,
        price: Math.round(amount * 100) // Convert to cents
      }]
    };

    // Call AbacatePay API
    const abacatePayResponse = await fetch('https://api.abacatepay.com/v1/billing/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('ABACATEPAY_API_TOKEN')}`
      },
      body: JSON.stringify(billingData)
    });

    if (!abacatePayResponse.ok) {
      const errorText = await abacatePayResponse.text();
      console.error('AbacatePay API error:', errorText);
      throw new Error(`AbacatePay API error: ${abacatePayResponse.status}`);
    }

    const abacatePayResult = await abacatePayResponse.json();
    console.log('AbacatePay billing created:', abacatePayResult.data.id);

    // Generate next payment date (1 month from now)
    const nextPayment = new Date();
    nextPayment.setMonth(nextPayment.getMonth() + 1);

    // Update user profile with subscription info
    const { error: updateProfileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user_id,
        assinatura_id: abacatePayResult.data.id,
        data_assinatura: new Date().toISOString(),
        proximo_pagamento: nextPayment.toISOString(),
        assinatura_ativa: false, // Will be activated when payment is confirmed
        updated_at: new Date().toISOString()
      });

    if (updateProfileError) {
      console.error('Error updating user profile:', updateProfileError);
      throw updateProfileError;
    }

    // Create payment record
    const { error: insertPaymentError } = await supabase
      .from('pagamentos')
      .insert({
        user_id: user_id,
        assinatura_id: abacatePayResult.data.id,
        efi_charge_id: abacatePayResult.data.id, // Using AbacatePay billing ID
        valor: amount,
        metodo_pagamento: 'pix',
        status: 'pending'
      });

    if (insertPaymentError) {
      console.error('Error creating payment record:', insertPaymentError);
      throw insertPaymentError;
    }

    console.log('Billing and payment records created successfully');

    return new Response(
      JSON.stringify({
        success: true,
        billing_id: abacatePayResult.data.id,
        redirect_url: abacatePayResult.data.url,
        message: 'Cobrança criada com sucesso'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error creating AbacatePay billing:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Falha ao criar cobrança',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});