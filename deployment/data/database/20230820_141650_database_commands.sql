ALTER TABLE "tasktracker$teammember" DROP COLUMN "phonenumber";
ALTER TABLE "tasktracker$teammember" ADD "phonenumber" VARCHAR_IGNORECASE(10) NULL;
UPDATE "mendixsystem$attribute" SET "entity_id" = '84961d08-c37c-4f6a-9ccf-113ab1794aa3', "attribute_name" = 'PhoneNumber', "column_name" = 'phonenumber', "type" = 30, "length" = 10, "default_value" = '', "is_auto_number" = false WHERE "id" = '40dc6a28-ea6c-4185-9bc3-18b714d1b240';
UPDATE "mendixsystem$version" SET "versionnumber" = '4.2', "lastsyncdate" = '20230820 14:16:50';
