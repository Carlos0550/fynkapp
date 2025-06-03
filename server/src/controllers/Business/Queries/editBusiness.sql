UPDATE business 
    SET 
        business_name = $1,
        business_phone = $2,
        business_address = $3
    WHERE business_id = $4;