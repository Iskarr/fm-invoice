-- Insert addresses
INSERT INTO addresses (id, street, city, post_code, country) 
VALUES (101, '19 Union Terrace', 'London', 'E1 3EZ', 'United Kingdom');

INSERT INTO addresses (id, street, city, post_code, country) 
VALUES (102, '84 Church Way', 'Bradford', 'BD1 9PB', 'United Kingdom');

INSERT INTO addresses (id, street, city, post_code, country) 
VALUES (103, '79 Dover Road', 'Westhall', 'IP19 3PF', 'United Kingdom');

INSERT INTO addresses (id, street, city, post_code, country) 
VALUES (104, '63 Warwick Road', 'Carlisle', 'CA20 2TG', 'United Kingdom');

INSERT INTO addresses (id, street, city, post_code, country) 
VALUES (105, '46 Abbey Row', 'Cambridge', 'CB5 6EG', 'United Kingdom');

INSERT INTO addresses (id, street, city, post_code, country) 
VALUES (106, '3964 Queens Lane', 'Gotham', '60457', 'United States of America');

INSERT INTO addresses (id, street, city, post_code, country) 
VALUES (107, '', '', '', '');

-- Insert invoices
INSERT INTO invoices (id, created_at, payment_due, description, payment_terms, client_name, client_email, status, sender_address_id, client_address_id, total) 
VALUES ('XM9141', '2021-08-21', '2021-09-20', 'Graphic Design', 30, 'Alex Grim', 'alexgrim@mail.com', 'pending', 101, 102, 556.00);

INSERT INTO invoices (id, created_at, payment_due, description, payment_terms, client_name, client_email, status, sender_address_id, client_address_id, total) 
VALUES ('RG0314', '2021-09-24', '2021-10-01', 'Website Redesign', 7, 'John Morrison', 'jm@myco.com', 'paid', 101, 103, 14002.33);

INSERT INTO invoices (id, created_at, payment_due, description, payment_terms, client_name, client_email, status, sender_address_id, client_address_id, total) 
VALUES ('RT2080', '2021-10-11', '2021-10-12', 'Logo Concept', 1, 'Alysa Werner', 'alysa@email.co.uk', 'pending', 101, 104, 102.04);

INSERT INTO invoices (id, created_at, payment_due, description, payment_terms, client_name, client_email, status, sender_address_id, client_address_id, total) 
VALUES ('AA1449', '2021-10-7', '2021-10-14', 'Re-branding', 7, 'Mellisa Clarke', 'mellisa.clarke@example.com', 'pending', 101, 105, 4032.33);

INSERT INTO invoices (id, created_at, payment_due, description, payment_terms, client_name, client_email, status, sender_address_id, client_address_id, total) 
VALUES ('TY9141', '2021-10-01', '2021-10-31', 'Landing Page Design', 30, 'Thomas Wayne', 'thomas@dc.com', 'pending', 101, 106, 6155.91);

INSERT INTO invoices (id, created_at, payment_due, description, payment_terms, client_name, client_email, status, sender_address_id, client_address_id, total) 
VALUES ('FV2353', '2021-11-05', '2021-11-12', 'Logo Re-design', 7, 'Anita Wainwright', '', 'draft', 101, 107, 3102.04);

-- Insert invoice items
INSERT INTO invoice_items (id, invoice_id, name, quantity, price, total) 
VALUES (101, 'XM9141', 'Banner Design', 1, 156.00, 156.00);

INSERT INTO invoice_items (id, invoice_id, name, quantity, price, total) 
VALUES (102, 'XM9141', 'Email Design', 2, 200.00, 400.00);

INSERT INTO invoice_items (id, invoice_id, name, quantity, price, total) 
VALUES (103, 'RG0314', 'Website Redesign', 1, 14002.33, 14002.33);

INSERT INTO invoice_items (id, invoice_id, name, quantity, price, total) 
VALUES (104, 'RT2080', 'Logo Sketches', 1, 102.04, 102.04);

INSERT INTO invoice_items (id, invoice_id, name, quantity, price, total) 
VALUES (105, 'AA1449', 'New Logo', 1, 1532.33, 1532.33);

INSERT INTO invoice_items (id, invoice_id, name, quantity, price, total) 
VALUES (106, 'AA1449', 'Brand Guidelines', 1, 2500.00, 2500.00);

INSERT INTO invoice_items (id, invoice_id, name, quantity, price, total) 
VALUES (107, 'TY9141', 'Web Design', 1, 6155.91, 6155.91);

INSERT INTO invoice_items (id, invoice_id, name, quantity, price, total) 
VALUES (108, 'FV2353', 'Logo Re-design', 1, 3102.04, 3102.04);