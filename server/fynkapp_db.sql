DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS debts CASCADE;
DROP TABLE IF EXISTS delivers CASCADE;
DROP TABLE IF EXISTS client_history CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP FUNCTION IF EXISTS set_exp_date();
DROP FUNCTION IF EXISTS update_exp_date_on_delivers();

DROP TRIGGER IF EXISTS trigger_set_exp_date ON debts;
DROP TRIGGER IF EXISTS trigger_update_exp_date_on_delivers ON delivers;


CREATE TABLE managers(
	manager_id UUID DEFAULT gen_random_uuid() PRIMARY KEY UNIQUE,
	manager_name TEXT NOT NULL,
	manager_email TEXT NOT NULL,
	manager_password TEXT NOT NULL,
	manager_verified boolean default false
);

CREATE TYPE link_types AS ENUM('recovery', 'verification');
CREATE TABLE magic_links(
    link_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    manager_id UUID,
    created_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used boolean default false,
    link_type link_types NOT NULL, 
    CONSTRAINT fk_link_manager_id FOREIGN KEY(manager_id) REFERENCES managers(manager_id) ON DELETE CASCADE
);

CREATE TABLE clients(
	client_id UUID default gen_random_uuid() PRIMARY KEY,
	client_name TEXT NOT NULL,
	client_aditional_data JSONB,
	CONSTRAINT check_aditional_data_keys
    CHECK (client_aditional_data ?& ARRAY['client_dni', 'client_address', 'client_email']),
	manager_client_id UUID NOT NULL,
	CONSTRAINT fk_manager_client_id FOREIGN KEY(manager_client_id) REFERENCES managers(manager_id)
);

CREATE TABLE debts(
	debt_id TEXT PRIMARY KEY UNIQUE NOT NULL,
	debt_total NUMERIC(10, 2) NOT NULL,
    debt_date TIMESTAMP NOT NULL,
	exp_date TIMESTAMP NOT NULL,
	debt_products JSONB NOT NULL,
	manager_client_id UUID NOT NULL,
	client_debt_id UUID NOT NULL,
	CONSTRAINT fk_manager_client_id FOREIGN KEY(manager_client_id) REFERENCES managers(manager_id) ON DELETE CASCADE,
	CONSTRAINT fk_client_debt_id FOREIGN KEY(client_debt_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

CREATE TABLE delivers(
    deliver_id TEXT NOT NULL PRIMARY KEY UNIQUE,
    deliver_amount numeric(10,2) NOT NULL,
    deliver_date timestamp,
    manager_client_id uuid NOT NULL,
    client_deliver_id uuid NOT NULL,
    deliver_details text,
    CONSTRAINT fk_client_deliver_id FOREIGN KEY (client_deliver_id) REFERENCES clients (client_id) ON DELETE CASCADE,
    CONSTRAINT fk_manager_client_id FOREIGN KEY (manager_client_id) REFERENCES managers (manager_id) ON DELETE CASCADE
);

ALTER TABLE debts ADD COLUMN estado_financiero TEXT DEFAULT 'activo';
ALTER TABLE debts ADD COLUMN fecha_cierre TIMESTAMP;

ALTER TABLE delivers ADD COLUMN estado_financiero TEXT DEFAULT 'activo';
ALTER TABLE delivers ADD COLUMN fecha_cierre TIMESTAMP;



SELECT * from debts WHERE manager_client_id = 'f9819a7f-5e88-49c0-8410-350170159d07' AND client_debt_id = 'eeefa567-b3f3-4cbc-91ef-9b2760de7d60'; 

TRUNCATE TABLE debts CASCADE;
SELECT * FROM debts;
SELECT * FROM delivers;