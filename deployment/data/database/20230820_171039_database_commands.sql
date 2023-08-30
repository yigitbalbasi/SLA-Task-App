ALTER TABLE "tasktracker$teammember" DROP COLUMN "department";
ALTER TABLE "tasktracker$teammember" DROP COLUMN "role";
DELETE FROM "mendixsystem$attribute"  WHERE "id" = '6087212e-cb95-4562-946c-55660bfe241b';
DELETE FROM "mendixsystem$attribute"  WHERE "id" = '6340e1c1-5144-41dc-a868-3478090982da';
ALTER TABLE "tasktracker$department" ADD "role" VARCHAR_IGNORECASE(200) NULL;
INSERT INTO "mendixsystem$attribute" ("id", "entity_id", "attribute_name", "column_name", "type", "length", "default_value", "is_auto_number") VALUES ('218f63a2-d9e5-4505-b1b8-9d6cca673c44', 'bde19e81-9775-49e8-b279-2f92884422ae', 'Role', 'role', 30, 200, '', false);
UPDATE "mendixsystem$version" SET "versionnumber" = '4.2', "lastsyncdate" = '20230820 17:10:39';
