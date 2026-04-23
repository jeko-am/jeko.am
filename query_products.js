const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dzhtpnskezkrtfinntbi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aHRwbnNrZXprcnRmaW5udGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTkyNjUsImV4cCI6MjA4OTU5NTI2NX0.zbanogFhN5SfMwPHym9PWfq6o9zgCEKsSAp-a9mjDrA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`Total products: ${data.length}`);
  console.log('\nProducts:');
  data.forEach(product => {
    console.log(`- ${product.name} (ID: ${product.id}, Price: $${product.price})`);
  });
}

getProducts();
