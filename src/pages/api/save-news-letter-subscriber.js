import { NextResponse } from 'next/server';
import { supabase } from '../../util/supabaseClient';

export default async function handler(req, res) {
  try {
    const data = req.body;
    console.log(data);

    const response = await supabase.from('news_letter_subscribers').insert({
      email: data.email,
      organisation_id: data.organisationId,
    });

    console.log('Response from Supabase:', response);

    res.send({
      success: true,
      message: 'Coupon redeemed successfully',
    });
  } catch (error) {
    console.error('Error redeeming coupon:', error);
    return NextResponse.json(
      { error: 'Failed to redeem coupon' },
      { status: 500 }
    );
  }
}
