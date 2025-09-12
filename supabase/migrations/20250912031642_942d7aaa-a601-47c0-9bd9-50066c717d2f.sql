-- Critical Security Fix: Secure Payment Transaction Data Access
-- This migration addresses the vulnerability where payment transaction details 
-- could be exposed to unauthorized users

-- Step 1: Drop any existing overly permissive policies
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;

-- Step 2: Create comprehensive RLS policies for payments table

-- Policy 1: Customers can view payments for their own bookings
CREATE POLICY "Customers can view their booking payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = payments.booking_id 
            AND b.customer_id = auth.uid()
        )
    );

-- Policy 2: Service providers can view payments for their services
CREATE POLICY "Providers can view their service payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = payments.booking_id 
            AND b.provider_id = auth.uid()
        )
    );

-- Policy 3: Only allow payment creation by the system (via secure functions)
-- No direct INSERT policy - payments should only be created through secure functions

-- Policy 4: Only allow payment status updates by authorized system functions
-- No direct UPDATE policy - payment updates should only happen through secure functions

-- Policy 5: No DELETE operations allowed on payments for audit trail
-- No DELETE policy - payments must be preserved for financial records

-- Step 3: Create secure function for payment creation
CREATE OR REPLACE FUNCTION public.create_payment(
    p_booking_id UUID,
    p_amount NUMERIC,
    p_payment_method payment_method DEFAULT 'upi',
    p_transaction_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    payment_id UUID;
    booking_customer_id UUID;
BEGIN
    -- Verify the booking exists and the user is the customer
    SELECT customer_id INTO booking_customer_id
    FROM public.bookings
    WHERE id = p_booking_id AND customer_id = auth.uid();
    
    IF booking_customer_id IS NULL THEN
        RAISE EXCEPTION 'Access denied: You can only create payments for your own bookings';
    END IF;
    
    -- Create the payment record
    INSERT INTO public.payments (booking_id, amount, payment_method, transaction_id, status)
    VALUES (p_booking_id, p_amount, p_payment_method, p_transaction_id, 'pending')
    RETURNING id INTO payment_id;
    
    RETURN payment_id;
END;
$$;

-- Step 4: Create secure function for payment status updates
CREATE OR REPLACE FUNCTION public.update_payment_status(
    p_payment_id UUID,
    p_status payment_status,
    p_transaction_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    booking_exists BOOLEAN;
BEGIN
    -- Verify the user has access to this payment (either customer or provider)
    SELECT EXISTS (
        SELECT 1 FROM public.payments pay
        JOIN public.bookings b ON pay.booking_id = b.id
        WHERE pay.id = p_payment_id
        AND (b.customer_id = auth.uid() OR b.provider_id = auth.uid())
    ) INTO booking_exists;
    
    IF NOT booking_exists THEN
        RAISE EXCEPTION 'Access denied: You do not have permission to update this payment';
    END IF;
    
    -- Update the payment status
    UPDATE public.payments
    SET 
        status = p_status,
        transaction_id = COALESCE(p_transaction_id, transaction_id)
    WHERE id = p_payment_id;
    
    RETURN TRUE;
END;
$$;

-- Step 5: Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.create_payment(UUID, NUMERIC, payment_method, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_payment_status(UUID, payment_status, TEXT) TO authenticated;