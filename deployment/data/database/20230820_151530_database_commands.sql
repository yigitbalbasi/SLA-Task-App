ALTER TABLE "tasktracker$teammember" DROP COLUMN "bio";
ALTER TABLE "tasktracker$teammember" ADD "role" VARCHAR_IGNORECASE(20) NULL;
DELETE FROM "mendixsystem$attribute"  WHERE "id" = '81d80999-c125-4d9b-a8db-b8923d19aead';
INSERT INTO "mendixsystem$attribute" ("id", "entity_id", "attribute_name", "column_name", "type", "length", "default_value", "is_auto_number") VALUES ('6340e1c1-5144-41dc-a868-3478090982da', '84961d08-c37c-4f6a-9ccf-113ab1794aa3', 'Role', 'role', 30, 20, '', false);
UPDATE "mendixsystem$version" SET "versionnumber" = '4.2', "lastsyncdate" = '20230820 15:15:29';
