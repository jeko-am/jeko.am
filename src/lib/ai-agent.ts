import { supabase } from '@/lib/supabase';

export interface AICommand {
  type: 'order' | 'inventory' | 'unknown';
  action: string;
  targets: string[];
  exceptions: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  confidence: number;
  explanation: string;
}

export interface AIResponse {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;
  command: AICommand;
}

/**
 * AI Agent Service for Natural Language Admin Commands
 */
export class AIAgent {
  /**
   * Process natural language command and execute database changes
   */
  async processCommand(input: string): Promise<AIResponse> {
    try {
      // Parse the command
      const command = this.parseCommand(input);
      
      if (command.type === 'unknown') {
        return {
          success: false,
          message: "I couldn't understand that command. Please try phrases like 'mark all orders shipped except 101' or 'make product X out of stock'.",
          details: null,
          command
        };
      }

      // Execute the command
      let result;
      switch (command.type) {
        case 'order':
          result = await this.executeOrderCommand(command);
          break;
        case 'inventory':
          result = await this.executeInventoryCommand(command);
          break;
        default:
          throw new Error('Unknown command type');
      }

      return {
        success: true,
        message: this.generateSuccessMessage(command, result),
        details: result,
        command
      };

    } catch (error) {
      return {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: null,
        command: {
          type: 'unknown',
          action: '',
          targets: [],
          exceptions: [],
          confidence: 0,
          explanation: 'Failed to process command'
        }
      };
    }
  }

  /**
   * Parse natural language into structured command
   */
  private parseCommand(input: string): AICommand {
    const normalizedInput = input.toLowerCase().trim();

    // Order management patterns
    if (this.isOrderCommand(normalizedInput)) {
      return this.parseOrderCommand(normalizedInput);
    }

    // Inventory management patterns  
    if (this.isInventoryCommand(normalizedInput)) {
      return this.parseInventoryCommand(normalizedInput);
    }

    return {
      type: 'unknown',
      action: '',
      targets: [],
      exceptions: [],
      confidence: 0,
      explanation: 'Could not identify command type'
    };
  }

  /**
   * Check if input is an order command
   */
  private isOrderCommand(input: string): boolean {
    const orderKeywords = ['order', 'orders', 'shipped', 'delivered', 'pending', 'processing', 'cancelled', 'mark', 'set', 'change', 'update'];
    return orderKeywords.some(keyword => input.includes(keyword));
  }

  /**
   * Check if input is an inventory command
   */
  private isInventoryCommand(input: string): boolean {
    const inventoryKeywords = ['inventory', 'stock', 'product', 'out of stock', 'reduce', 'increase', 'quantity', 'available'];
    return inventoryKeywords.some(keyword => input.includes(keyword));
  }

  /**
   * Parse order-related commands
   */
  private parseOrderCommand(input: string): AICommand {
    const command: AICommand = {
      type: 'order',
      action: '',
      targets: [],
      exceptions: [],
      confidence: 0.8,
      explanation: ''
    };

    // Extract action (status to set)
    const statusPatterns = {
      'shipped': 'shipped',
      'delivered': 'delivered', 
      'pending': 'pending',
      'processing': 'processing',
      'cancelled': 'cancelled'
    };

    for (const [pattern, status] of Object.entries(statusPatterns)) {
      if (input.includes(pattern)) {
        command.action = status;
        break;
      }
    }

    // Extract date range
    const dateRangeMatch = input.match(/from\s+(\d{1,2}\s+\w+\s+\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})\s+to\s+(\d{1,2}\s+\w+\s+\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/i);
    if (dateRangeMatch) {
      command.dateRange = {
        from: this.parseDate(dateRangeMatch[1]),
        to: this.parseDate(dateRangeMatch[2])
      };
    }

    // Extract order numbers
    const allOrderNumbers = this.extractOrderNumbers(input);
    
    // Handle "except" patterns
    const exceptIndex = input.indexOf('except');
    if (exceptIndex !== -1) {
      const afterExcept = input.substring(exceptIndex + 6);
      command.exceptions = this.extractOrderNumbers(afterExcept);
      command.targets = allOrderNumbers.filter(num => !command.exceptions.includes(num));
    } else {
      command.targets = allOrderNumbers;
    }

    // Handle "all" pattern or date range
    if (input.includes('all') || command.dateRange) {
      command.targets = ['all'];
    }

    // Generate explanation
    let explanation = `Will ${command.action}`;
    if (command.dateRange) {
      explanation += ` orders from ${command.dateRange.from} to ${command.dateRange.to}`;
    } else if (command.targets.includes('all')) {
      explanation += ` all orders`;
    } else {
      explanation += ` orders ${command.targets.join(', ')}`;
    }
    
    if (command.exceptions.length > 0) {
      explanation += ` except ${command.exceptions.join(', ')}`;
    }
    
    command.explanation = explanation;
    
    return command;
  }

  /**
   * Parse various date formats to ISO format
   */
  private parseDate(dateStr: string): string {
    // Handle formats like "24 Mar 2026", "2026-03-24", "03/24/2026"
    const monthMap: { [key: string]: string } = {
      'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
      'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
    };

    // Format: "24 Mar 2026"
    const dayMonthYearMatch = dateStr.match(/(\d{1,2})\s+([a-z]{3})\s+(\d{4})/i);
    if (dayMonthYearMatch) {
      const [, day, month, year] = dayMonthYearMatch;
      return `${year}-${monthMap[month.toLowerCase()]}-${day.padStart(2, '0')}`;
    }

    // Format: "2026-03-24"
    const isoMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return dateStr;
    }

    // Format: "03/24/2026" or "24/03/2026"
    const slashMatch = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (slashMatch) {
      // Assume MM/DD/YYYY format, but could be DD/MM/YYYY
      const [, part1, part2, year] = slashMatch;
      // If first part > 12, it's likely DD/MM/YYYY
      if (parseInt(part1) > 12) {
        return `${year}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`;
      } else {
        return `${year}-${part1.padStart(2, '0')}-${part2.padStart(2, '0')}`;
      }
    }

    // Default to today if parsing fails
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Parse inventory-related commands
   */
  private parseInventoryCommand(input: string): AICommand {
    const command: AICommand = {
      type: 'inventory',
      action: '',
      targets: [],
      exceptions: [],
      confidence: 0.8,
      explanation: ''
    };

    // Extract product names (simplified - would need product lookup in real implementation)
    const productMatch = input.match(/make\s+([^]+)\s+out of stock|make\s+([^]+)\s+out of stock|product\s+([^]+)|([^]+)\s+product/i);
    if (productMatch) {
      const productName = productMatch[1] || productMatch[2] || productMatch[3] || productMatch[4];
      if (productName) {
        command.targets = [productName.trim()];
      }
    }

    // Extract action
    if (input.includes('out of stock')) {
      command.action = 'out_of_stock';
    } else if (input.includes('reduce')) {
      command.action = 'reduce';
      const quantityMatch = input.match(/reduce\s+by\s+(\d+)/);
      if (quantityMatch) {
        command.action += `_${quantityMatch[1]}`;
      }
    } else if (input.includes('increase')) {
      command.action = 'increase';
      const quantityMatch = input.match(/increase\s+by\s+(\d+)/);
      if (quantityMatch) {
        command.action += `_${quantityMatch[1]}`;
      }
    }

    command.explanation = `Will ${command.action} for product: ${command.targets.join(', ')}`;
    
    return command;
  }

  /**
   * Extract order numbers from text
   */
  private extractOrderNumbers(text: string): string[] {
    const matches = text.match(/\b\d+\b/g);
    return matches ? matches : [];
  }

  /**
   * Execute order-related database changes
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async executeOrderCommand(command: AICommand): Promise<any> {
    let query = supabase.from('orders').update({ 
      status: command.action,
      updated_at: new Date().toISOString()
    });

    // Apply filters based on command type
    if (command.dateRange) {
      // Filter by date range
      query = query
        .gte('created_at', `${command.dateRange.from}T00:00:00.000Z`)
        .lte('created_at', `${command.dateRange.to}T23:59:59.999Z`);
    }

    // Handle exceptions
    if (command.exceptions.length > 0) {
      if (command.dateRange) {
        // For date range with exceptions, we need to get orders first, then filter
        const baseQuery = supabase
          .from('orders')
          .select('order_number')
          .gte('created_at', `${command.dateRange.from}T00:00:00.000Z`)
          .lte('created_at', `${command.dateRange.to}T23:59:59.999Z`);
        
        const { data: ordersInRange, error: fetchError } = await baseQuery;
        if (fetchError) throw fetchError;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const orderNumbersToUpdate = (ordersInRange as any[])
          .map(order => order.order_number)
          .filter(num => !command.exceptions.includes(num.toString()));
        
        if (orderNumbersToUpdate.length > 0) {
          const { data, error } = await supabase
            .from('orders')
            .update({ 
              status: command.action,
              updated_at: new Date().toISOString()
            })
            .in('order_number', orderNumbersToUpdate);
          
          if (error) throw error;
          return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updated: (data as unknown as any[])?.length || 0,
            type: 'date_range',
            dateRange: command.dateRange,
            exceptions: command.exceptions
          };
        } else {
          return { 
            updated: 0, 
            type: 'date_range',
            dateRange: command.dateRange,
            exceptions: command.exceptions
          };
        }
      } else {
        // For "all orders" with exceptions, use the existing logic
        const { data: allOrders, error: fetchError } = await supabase
          .from('orders')
          .select('order_number');
        
        if (fetchError) throw fetchError;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const orderNumbersToUpdate = (allOrders as any[])
          .map(order => order.order_number)
          .filter(num => !command.exceptions.includes(num.toString()));
        
        if (orderNumbersToUpdate.length > 0) {
          const { data, error } = await supabase
            .from('orders')
            .update({ 
              status: command.action,
              updated_at: new Date().toISOString()
            })
            .in('order_number', orderNumbersToUpdate);
          
          if (error) throw error;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return { updated: (data as unknown as any[])?.length || 0, type: 'all_orders' };
        } else {
          return { updated: 0, type: 'all_orders' };
        }
      }
    }

    // Execute the query (for simple cases without exceptions)
    const { data, error } = await query;
    if (error) throw error;
    
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updated: (data as unknown as any[])?.length || 0,
      type: command.dateRange ? 'date_range' : 'all_orders',
      dateRange: command.dateRange
    };
  }

  /**
   * Execute inventory-related database changes
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async executeInventoryCommand(command: AICommand): Promise<any> {
    const productName = command.targets[0];
    if (!productName) {
      throw new Error('No product specified');
    }

    // First, find the product by name
    const { data: products, error: searchError } = await supabase
      .from('products')
      .select('id, name, stock_quantity, is_active')
      .ilike('name', `%${productName}%`)
      .limit(1);

    if (searchError) throw searchError;
    if (!products || products.length === 0) {
      throw new Error(`Product "${productName}" not found`);
    }

    const product = products[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updatedData: any = {};

    // Parse the action and update accordingly
    if (command.action === 'out_of_stock') {
      updatedData = {
        stock_quantity: 0,
        is_active: false,
        updated_at: new Date().toISOString()
      };
    } else if (command.action.startsWith('reduce_')) {
      const reduceBy = parseInt(command.action.split('_')[1]) || 1;
      const newQuantity = Math.max(0, (product.stock_quantity || 0) - reduceBy);
      updatedData = {
        stock_quantity: newQuantity,
        is_active: newQuantity > 0,
        updated_at: new Date().toISOString()
      };
    } else if (command.action.startsWith('increase_')) {
      const increaseBy = parseInt(command.action.split('_')[1]) || 1;
      const newQuantity = (product.stock_quantity || 0) + increaseBy;
      updatedData = {
        stock_quantity: newQuantity,
        is_active: true,
        updated_at: new Date().toISOString()
      };
    } else {
      throw new Error('Unknown inventory action');
    }

    // Update the product
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update(updatedData)
      .eq('id', product.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      product: updatedProduct,
      previous_quantity: product.stock_quantity,
      new_quantity: updatedData.stock_quantity,
      action: command.action
    };
  }

  /**
   * Generate success message
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private generateSuccessMessage(command: AICommand, result: any): string {
    switch (command.type) {
      case 'order':
        if (command.dateRange) {
          const dateRangeText = `orders from ${command.dateRange.from} to ${command.dateRange.to}`;
          if (command.exceptions.length > 0) {
            return `Successfully updated ${result.updated} ${dateRangeText} to ${command.action} (except ${command.exceptions.join(', ')})`;
          } else {
            return `Successfully updated ${result.updated} ${dateRangeText} to ${command.action}`;
          }
        } else if (command.targets.includes('all')) {
          return `Successfully updated ${result.updated} orders to ${command.action}${command.exceptions.length > 0 ? ` (except ${command.exceptions.join(', ')})` : ''}`;
        } else {
          return `Successfully updated ${result.updated} orders (${command.targets.join(', ')}) to ${command.action}`;
        }
      case 'inventory':
        const productName = result.product?.name || command.targets[0];
        const actionText = command.action === 'out_of_stock' 
          ? 'marked as out of stock'
          : command.action.startsWith('reduce_')
          ? `reduced by ${command.action.split('_')[1]} units`
          : command.action.startsWith('increase_')
          ? `increased by ${command.action.split('_')[1]} units`
          : 'updated';
        
        return `Successfully ${actionText} for "${productName}" (from ${result.previous_quantity} to ${result.new_quantity})`;
      default:
        return 'Command executed successfully';
    }
  }
}

// Singleton instance
export const aiAgent = new AIAgent();
