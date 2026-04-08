import { supabase } from '@/lib/supabase';
import { CartItem } from './cart-context';

export interface OrderData {
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  shipping_address: {
    line1: string;
    city: string;
    postal_code: string;
    country: string;
  };
  payment_method: 'card' | 'paypal';
  items: CartItem[];
  subtotal: number;
  shipping_amount: number;
  tax_amount: number;
  total: number;
  user_id?: string; // Optional - for logged-in users
}

export interface CreatedOrder {
  id: string;
  order_number: number;
  customer_id: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_address: string | null;
  billing_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Create a new order in the database
 */
export async function createOrder(orderData: OrderData): Promise<CreatedOrder> {
  try {
    // Determine if this is a logged-in user or guest checkout
    const isGuestCheckout = !orderData.user_id;
    let customerId = null;
    
    // For logged-in users, try to find existing customer or create one
    if (!isGuestCheckout) {
      const { data: existingCustomer, error: customerLookupError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', orderData.user_id)
        .single();
      
      if (customerLookupError && customerLookupError.code !== 'PGRST116') {
        console.warn('Error looking up customer:', customerLookupError);
      }
      
      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        // Create customer record for logged-in user
        const { data: newCustomer, error: customerCreateError } = await supabase
          .from('customers')
          .insert({
            user_id: orderData.user_id,
            first_name: orderData.customer_first_name,
            last_name: orderData.customer_last_name,
            email: orderData.customer_email,
            phone: orderData.customer_phone,
          })
          .select()
          .single();
        
        if (customerCreateError) {
          console.warn('Failed to create customer record:', customerCreateError);
        } else {
          customerId = newCustomer.id;
        }
      }
    }
    
    // Start a transaction by creating the order first
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        user_id: orderData.user_id || null,
        order_number: generateOrderNumber(),
        status: 'pending',
        subtotal: orderData.subtotal,
        discount_amount: 0,
        shipping_amount: orderData.shipping_amount,
        tax_amount: orderData.tax_amount,
        total: orderData.total,
        payment_status: 'paid', // Directly mark as paid
        currency: 'GBP',
        shipping_address_line1: orderData.shipping_address.line1,
        shipping_city: orderData.shipping_address.city,
        shipping_postcode: orderData.shipping_address.postal_code,
        shipping_country: orderData.shipping_address.country,
        billing_address_line1: orderData.shipping_address.line1,
        billing_city: orderData.shipping_address.city,
        billing_postcode: orderData.shipping_address.postal_code,
        notes: `Payment method: ${orderData.payment_method}. Customer: ${orderData.customer_first_name} ${orderData.customer_last_name}, Email: ${orderData.customer_email}, Phone: ${orderData.customer_phone}`,
      })
      .select()
      .single();

    if (orderError) throw orderError;
    if (!order) throw new Error('Failed to create order');

    // For guest checkout, create customer record after order
    if (isGuestCheckout) {
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({
          user_id: null,
          first_name: orderData.customer_first_name,
          last_name: orderData.customer_last_name,
          email: orderData.customer_email,
          phone: orderData.customer_phone,
        })
        .select()
        .single();

      if (customerError) {
        console.warn('Failed to create customer record:', customerError);
      }

      // Update order with customer_id if customer was created
      if (customer) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({ customer_id: customer.id })
          .eq('id', order.id);

        if (updateError) {
          console.warn('Failed to update order with customer_id:', updateError);
        }
      }
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      variant_id: item.variant_id || null,
      product_name: item.name,
      variant_name: item.variant_name || null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Update order status to processing
    const { data: updatedOrder, error: statusError } = await supabase
      .from('orders')
      .update({ 
        status: 'processing',
        payment_status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id)
      .select()
      .single();

    if (statusError) throw statusError;
    if (!updatedOrder) throw new Error('Failed to update order status');

    return updatedOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Generate a unique order number
 */
function generateOrderNumber(): number {
  // Use timestamp + random for uniqueness
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return parseInt(`${timestamp}${random}`.slice(-8));
}

/**
 * Format address for database storage
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _formatAddress(address: {
  line1: string;
  city: string;
  postal_code: string;
  country: string;
}): string {
  return JSON.stringify(address);
}

/**
 * Calculate order totals
 */
export function calculateOrderTotals(items: CartItem[]): {
  subtotal: number;
  shipping_amount: number;
  tax_amount: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping_amount = 0; // Free shipping
  const tax_amount = 0; // No tax for now
  const total = subtotal + shipping_amount + tax_amount;

  return {
    subtotal,
    shipping_amount,
    tax_amount,
    total,
  };
}
