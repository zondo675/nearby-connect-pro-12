-- Critical Security Fix: Complete Payment Security Implementation
-- Add secure functions for payment operations and ensure proper audit trail

-- Step 1: Create secure function for payment creation (if not exists)
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

-- Step 2: Create secure function for payment status updates (if not exists)
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

-- Step 3: Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.create_payment(UUID, NUMERIC, payment_method, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_payment_status(UUID, payment_status, TEXT) TO authenticated;

-- Step 4: Add comments for security documentation
COMMENT ON FUNCTION public.create_payment IS 'Securely creates payment records with proper authorization checks';
COMMENT ON FUNCTION public.update_payment_status IS 'Securely updates payment status with proper authorization checks';
COMMENT ON TABLE public.payments IS 'Critical financial data - access strictly controlled via RLS policies and secure functions';