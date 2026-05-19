-- Migration to add a sequence for sequential quote numbers
CREATE SEQUENCE IF NOT EXISTS quote_number_seq START 1;
