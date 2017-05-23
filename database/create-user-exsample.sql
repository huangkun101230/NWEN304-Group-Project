DO $$
DECLARE
    user BIGINT ;
BEGIN


INSERT INTO users (username,password) VALUES ('bdsfjkghdsgob','tesugdfyugsdft') RETURNS user_id;
SELECT currval(pg_get_serial_sequence('users','user_id')) RETURNS user_id INTO user;
RAISE NOTICE '%', user;
--INSERT INTO user_cart (user_id) VALUES (user);
END $$;

INSERT INTO users (username,password) VALUES ('bdsfjkghdsgob','tesugdfyugsdft') RETURNS user_id;

INSERT INTO user_cart (user_id) VALUES (6);