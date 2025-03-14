CREATE TABLE users(
	user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	user_name TEXT NOT NULL,
	user_lastname TEXT NOT NULL,
	user_email TEXT NOT NULL,
	user_password TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clients (
  client_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fk_user_id UUID NOT NULL,
  client_dni TEXT,
  client_fullname TEXT,
  client_email TEXT,
  client_address TEXT,
  client_city TEXT,
  client_phone TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_client_admin FOREIGN KEY(fk_user_id) REFERENCES users(user_id)
);

CREATE TABLE debts(
	debt_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	client_debt_id UUID NOT NULL,
	fk_user_id UUID NOT NULL,
	debt_products JSONB NOT NULL,
	debt_date DATE NOT NULL,
	exp_date DATE,
	debt_status TEXT NOT NULL DEFAULT 'active',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_client_debt_id FOREIGN KEY(client_debt_id) REFERENCES clients(client_id),
	CONSTRAINT fk_user_client_id FOREIGN KEY(fk_user_id) REFERENCES users(user_id)
);

CREATE OR REPLACE FUNCTION set_exp_date()
RETURNS TRIGGER AS $$
BEGIN
	NEW.exp_date := NEW.debt_date + INTERVAL '1 month';
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_exp_date
BEFORE INSERT ON debts
FOR EACH ROW
EXECUTE FUNCTION set_exp_date();

CREATE TABLE delivers(
	deliver_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	deliver_client_id UUID,
	deliver_user_id UUID NOT NULL,
	deliver_amount BIGINT NOT NULL,
	deliver_date DATE NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_deliver_client_id FOREIGN KEY(deliver_client_id) REFERENCES clients(client_id),
	CONSTRAINT fk_deliver_user_id FOREIGN KEY(deliver_user_id) REFERENCES users(user_id)
);

CREATE OR REPLACE FUNCTION update_exp_date_on_delivers()
RETURNS TRIGGER AS $$
BEGIN
	UPDATE debts
	SET exp_date = exp_date + INTERVAL '1 month',
	debt_status = 'active'
	WHERE client_debt_id = NEW.deliver_client_id 
		AND fk_user_id = NEW.deliver_user_id
		AND debt_status = 'expired';
	RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER trigger_update_exp_date_on_delivers
AFTER INSERT ON delivers
FOR EACH ROW
EXECUTE FUNCTION update_exp_date_on_delivers();

CREATE TYPE record_type_enum AS ENUM ('debt', 'deliver');
CREATE TYPE source_table_enum AS ENUM ('debts', 'delivers');

CREATE TABLE history_debts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    client_id UUID NOT NULL,
    record_type record_type_enum NOT NULL,
    source_record_id UUID NOT NULL,
    source_table source_table_enum NOT NULL,
    details JSON NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    operation_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_client_history_id FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

