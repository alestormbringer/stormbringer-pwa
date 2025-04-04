-- Inserimento divinità
INSERT INTO deities (name, description, category) VALUES
('Arioch', 'Signore del Caos e della Distruzione', 'caos'),
('Mabelrode', 'Dio della Legge e dell''Ordine', 'legge'),
('Pyaray', 'Signore degli Elementi', 'elementali'),
('Xiombarg', 'Signora delle Bestie', 'signori_delle_bestie');

-- Inserimento nazioni
INSERT INTO nations (name, short_description, full_description) VALUES
('Melniboné', 'L''antico impero degli elfi', 'Melniboné è un antico impero elfico noto per la sua magia potente e la sua cultura decadente.'),
('Pan Tang', 'L''isola dei maghi neri', 'Pan Tang è un''isola governata da potenti maghi neri che praticano le arti oscure.'),
('Shazaar', 'La città delle mille torri', 'Shazaar è una città-stato ricca e potente, famosa per le sue torri magiche e i suoi mercanti.'),
('Vilmir', 'La terra dei guerrieri', 'Vilmir è una nazione di fieri guerrieri che venerano la forza e l''onore.');

-- Inserimento equipaggiamento
INSERT INTO equipment (name, description, category, stats) VALUES
('Spada Nera', 'Una spada leggendaria forgiata con metallo alieno', 'armi', '{"danno": 10, "precisione": 8, "durabilita": 100}'),
('Armatura di Drago', 'Armatura ricavata dalle scaglie di un drago', 'armature', '{"difesa": 15, "resistenza": 12, "peso": 8}'),
('Anello del Potere', 'Un anello che aumenta le capacità magiche', 'accessori', '{"magia": 5, "volonta": 3}'),
('Arco Lunare', 'Un arco che trae potere dalla luna', 'armi', '{"danno": 8, "precisione": 10, "gittata": 20}');

-- Nota: Per le tabelle characters, campaigns e messages, i dati verranno inseriti automaticamente
-- quando gli utenti interagiranno con l''applicazione, poiché richiedono riferimenti a utenti esistenti. 