-- Migrate data from name column to basicInfo column
UPDATE "User" SET "basicInfo" = jsonb_set("basicInfo", '{name}', to_jsonb("name"));

-- Also add default empty city and streetNumber to avoid null issues in further operations
UPDATE "User" SET "basicInfo" = jsonb_set("basicInfo", '{address}', '{"city": "", "streetNumber": ""}'::jsonb);
