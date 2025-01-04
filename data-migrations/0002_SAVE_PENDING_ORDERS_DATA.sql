INSERT INTO public.pending_orders (id, instrumentid, userid, size, price, type, side, status, datetime)
SELECT id, instrumentid, userid, "size", price, "type", side, status, datetime
FROM public.orders
WHERE status NOT IN ('REJECTED', 'CANCELLED', 'FILLED');