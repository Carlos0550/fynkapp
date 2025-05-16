SELECT * FROM magic_links WHERE link_id = $1 AND manager_id = $2 AND link_type = $3;

UPDATE magic_links SET used = true WHERE link_id = $1;
UPDATE managers SET manager_verified = true WHERE manager_id = $1;