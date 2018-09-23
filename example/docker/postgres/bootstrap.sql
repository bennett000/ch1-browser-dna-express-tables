CREATE USER browser_dna_example WITH PASSWORD 'this-is-dev';
CREATE DATABASE browser_dna_example
    OWNER browser_dna_example TEMPLATE template0 ENCODING 'UTF8';

GRANT ALL PRIVILEGES ON DATABASE browser_dna_example TO browser_dna_example;
