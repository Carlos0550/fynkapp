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

CREATE TABLE account_summary (
  summary_id UUID PRIMARY KEY UNIQUE,
  manager_id UUID REFERENCES managers(manager_id),
  as_of TIMESTAMP NOT NULL,
  total_debt NUMERIC(10,2) NOT NULL,
  total_payments NUMERIC(10,2) NOT NULL,
  best_customers JSONB NOT NULL,
  worst_customers JSONB NOT NULL,
  payment_behavior JSONB NOT NULL,
  recovery_rate NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

--NUEVO--

CREATE TABLE business(
	business_id UUID DEFAULT gen_random_uuid() PRIMARY KEY UNIQUE,
	business_name TEXT NOT NULL,
	business_phone TEXT NOT NULL,
	business_address TEXT,
	manager_business_id UUID NOT NULL,
	notif_option TEXT NOT NULL DEFAULT 'both',
	CONSTRAINT FK_manager_business_id FOREIGN KEY(manager_business_id) REFERENCES managers(manager_id) ON DELETE SET NULL
);

ALTER TABLE debts ADD COLUMN business_debt_id UUID;
ALTER TABLE delivers ADD COLUMN business_deliver_id UUID;

ALTER TABLE debts ADD CONSTRAINT fk_business_debt_id FOREIGN KEY(business_debt_id) REFERENCES business(business_id);
ALTER TABLE delivers ADD CONSTRAINT fk_business_delivers_id FOREIGN KEY(business_deliver_id) REFERENCES business(business_id);

ALTER TABLE clients DROP CONSTRAINT check_aditional_data_keys;

CREATE TABLE due_payments(
	due_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	due_client_id UUID NOT NULL,
	due_business_id UUID NOT NULL,
	due_amount NUMERIC(10,2) NOT NULL,
	due_date TIMESTAMP NOT NULL,
	created_at TIMESTAMP NOT NULL,
	notified BOOLEAN DEFAULT false NOT NULL,
	notified_at DATE,
	due_status TEXT NOT NULL,
	CONSTRAINT fk_due_client_id 
	FOREIGN KEY(due_client_id) REFERENCES clients(client_id),

	CONSTRAINT fk_due_business_id FOREIGN KEY(due_business_id)
	REFERENCES business(business_id)
);

ALTER TABLE debts ADD COLUMN business_debt_id UUID NOT NULL;
ALTER TABLE delivers ADD COLUMN business_deliver_id UUID NOT NULL;

ALTER TABLE debts ADD CONSTRAINT fk_business_debt_id FOREIGN KEY(
	business_debt_id
) REFERENCES business(business_id) ON DELETE CASCADE;

ALTER TABLE delivers ADD CONSTRAINT fk_business_deliver_id FOREIGN KEY(
	business_deliver_id
) REFERENCES business(business_id) ON DELETE CASCADE;

CREATE TABLE notif_history(
	notif_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	notif_business_id UUID,
	notif_client_id UUID,
	notif_channel TEXT,
	notif_status TEXT,
	notif_at TIMESTAMP,
	notif_type TEXT,
	CONSTRAINT fk_notif_client_id FOREIGN KEY(notif_client_id) REFERENCES clients(client_id),
	CONSTRAINT fk_notif_business_id FOREIGN KEY(notif_business_id) REFERENCES business(business_id)
);
CREATE INDEX idx_notif_client_date ON notif_history(notif_client_id, notif_at DESC);

TRUNCATE TABLE debts CASCADE;
SELECT * FROM debts;
