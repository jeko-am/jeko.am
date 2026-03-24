// Import types from the orders page
interface Order {
  id: string;
  customer_id: string;
  order_number: number;
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
  customers?: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  order_items?: OrderItem[];
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ExportOrderData {
  'Order Number': string;
  'Customer Name': string;
  'Customer Email': string;
  'Customer Phone': string;
  'Order Date': string;
  'Order Status': string;
  'Payment Status': string;
  'Product Names': string;
  'Product Quantities': string;
  'Product Prices': string;
  'Subtotal': string;
  'Shipping Amount': string;
  'Tax Amount': string;
  'Total': string;
  'Shipping Address': string;
  'Billing Address': string;
  'Notes': string;
}

/**
 * Export orders to CSV format (Excel-compatible)
 */
export function exportOrdersToCSV(orders: Order[]): void {
  if (orders.length === 0) {
    alert('No orders to export');
    return;
  }

  // Create CSV headers
  const headers: (keyof ExportOrderData)[] = [
    'Order Number',
    'Customer Name', 
    'Customer Email',
    'Customer Phone',
    'Order Date',
    'Order Status',
    'Payment Status',
    'Product Names',
    'Product Quantities', 
    'Product Prices',
    'Subtotal',
    'Shipping Amount',
    'Tax Amount',
    'Total',
    'Shipping Address',
    'Billing Address',
    'Notes'
  ];

  // Transform order data for export
  const exportData: ExportOrderData[] = orders.map(order => {
    // Extract customer info
    const customerName = order.customers 
      ? `${order.customers.first_name} ${order.customers.last_name}`
      : extractCustomerFromNotes(order.notes).name;
    
    const customerEmail = order.customers?.email || extractCustomerFromNotes(order.notes).email;
    const customerPhone = extractCustomerFromNotes(order.notes).phone;

    // Extract product information
    const productNames = order.order_items?.map((item: OrderItem) => item.product_name).join('; ') || '';
    const productQuantities = order.order_items?.map((item: OrderItem) => item.quantity.toString()).join('; ') || '';
    const productPrices = order.order_items?.map((item: OrderItem) => `£${item.unit_price.toFixed(2)}`).join('; ') || '';

    // Format addresses
    const shippingAddress = formatAddressForExport(order.shipping_address);
    const billingAddress = formatAddressForExport(order.billing_address);

    // Format date
    const orderDate = new Date(order.created_at).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short', 
      year: 'numeric'
    });

    return {
      'Order Number': order.order_number.toString(),
      'Customer Name': customerName,
      'Customer Email': customerEmail,
      'Customer Phone': customerPhone,
      'Order Date': orderDate,
      'Order Status': order.status,
      'Payment Status': order.payment_status,
      'Product Names': productNames,
      'Product Quantities': productQuantities,
      'Product Prices': productPrices,
      'Subtotal': `£${order.subtotal.toFixed(2)}`,
      'Shipping Amount': `£${order.shipping_amount.toFixed(2)}`,
      'Tax Amount': `£${order.tax_amount.toFixed(2)}`,
      'Total': `£${order.total.toFixed(2)}`,
      'Shipping Address': shippingAddress,
      'Billing Address': billingAddress,
      'Notes': order.notes || ''
    };
  });

  // Generate CSV content
  const csvContent = generateCSV(exportData, headers);
  
  // Download the file
  downloadCSV(csvContent, `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
}

/**
 * Generate CSV string from data
 */
function generateCSV(data: ExportOrderData[], headers: (keyof ExportOrderData)[]): string {
  // Add BOM for proper UTF-8 support in Excel
  const BOM = '\uFEFF';
  
  // Create header row
  const headerRow = headers.map(header => `"${header}"`).join(',');
  
  // Create data rows
  const dataRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma or quotes
      const escapedValue = value.toString().replace(/"/g, '""');
      return `"${escapedValue}"`;
    }).join(',')
  );

  return BOM + headerRow + '\n' + dataRows.join('\n');
}

/**
 * Download CSV file
 */
function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Extract customer info from notes field
 */
function extractCustomerFromNotes(notes: string | null): { name: string; email: string; phone: string } {
  const defaultCustomer = { name: '', email: '', phone: '' };
  
  if (!notes) return defaultCustomer;
  
  try {
    const customerMatch = notes.match(/Customer: ([^,]+), Email: ([^,]+), Phone: ([^,]+)/);
    if (customerMatch) {
      return {
        name: customerMatch[1] || '',
        email: customerMatch[2] || '',
        phone: customerMatch[3] || ''
      };
    }
  } catch (error) {
    console.warn('Failed to parse customer from notes:', error);
  }
  
  return defaultCustomer;
}

/**
 * Format address for export
 */
function formatAddressForExport(address: string | null): string {
  if (!address) return '';
  
  try {
    // If it's a JSON string, parse and format
    if (address.startsWith('{')) {
      const addr = JSON.parse(address);
      if (typeof addr === 'object' && addr !== null) {
        return [addr.line1, addr.line2, addr.city, addr.state, addr.postal_code, addr.country]
          .filter(Boolean)
          .join(', ');
      }
    }
  } catch (error) {
    // If parsing fails, return as-is
    return address;
  }
  
  return address;
}

/**
 * Export selected orders to CSV
 */
export function exportSelectedOrdersToCSV(selectedOrders: Order[]): void {
  if (selectedOrders.length === 0) {
    alert('Please select at least one order to export');
    return;
  }
  
  exportOrdersToCSV(selectedOrders);
}
