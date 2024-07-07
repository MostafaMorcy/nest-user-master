-- AddBasicInfo
ALTER TABLE "User" ADD COLUMN "basicInfo" JSONB NOT NULL DEFAULT '{}';

-- Migrate name data to basicInfo
UPDATE "User" SET "basicInfo" = jsonb_set("basicInfo", '{name}', to_jsonb("name"));

-- Add default empty city and streetNumber to avoid null issues in further operations
UPDATE "User" SET "basicInfo" = jsonb_set("basicInfo", '{address}', '{"city": "", "streetNumber": ""}'::jsonb);

-- Drop the redundant name column
ALTER TABLE "User" DROP COLUMN "name";

-- Drop the index if it exists
DROP INDEX IF EXISTS "User_name_key";
