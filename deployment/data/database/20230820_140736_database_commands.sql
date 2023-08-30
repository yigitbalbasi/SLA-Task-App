CREATE TABLE "tasktracker$teammember" (
	"id" BIGINT NOT NULL,
	"name" VARCHAR_IGNORECASE(200) NULL,
	"phonenumber" INT NULL,
	"email" VARCHAR_IGNORECASE(200) NULL,
	"birthday" TIMESTAMP NULL,
	"bio" VARCHAR_IGNORECASE(200) NULL,
	PRIMARY KEY("id"));
INSERT INTO "mendixsystem$entity" ("id", "entity_name", "table_name", "remote", "remote_primary_key") VALUES ('84961d08-c37c-4f6a-9ccf-113ab1794aa3', 'TaskTracker.TeamMember', 'tasktracker$teammember', false, false);
INSERT INTO "mendixsystem$attribute" ("id", "entity_id", "attribute_name", "column_name", "type", "length", "default_value", "is_auto_number") VALUES ('21324954-908b-4c9c-b2bd-d63bc5e1c13b', '84961d08-c37c-4f6a-9ccf-113ab1794aa3', 'Name', 'name', 30, 200, '', false);
INSERT INTO "mendixsystem$attribute" ("id", "entity_id", "attribute_name", "column_name", "type", "length", "default_value", "is_auto_number") VALUES ('40dc6a28-ea6c-4185-9bc3-18b714d1b240', '84961d08-c37c-4f6a-9ccf-113ab1794aa3', 'PhoneNumber', 'phonenumber', 3, 0, '0', false);
INSERT INTO "mendixsystem$attribute" ("id", "entity_id", "attribute_name", "column_name", "type", "length", "default_value", "is_auto_number") VALUES ('f240f04d-c77e-4e87-a095-a1c61e163773', '84961d08-c37c-4f6a-9ccf-113ab1794aa3', 'Email', 'email', 30, 200, '', false);
INSERT INTO "mendixsystem$attribute" ("id", "entity_id", "attribute_name", "column_name", "type", "length", "default_value", "is_auto_number") VALUES ('57bf1b8f-233c-41d0-87e5-d274f65bea9f', '84961d08-c37c-4f6a-9ccf-113ab1794aa3', 'BirthDay', 'birthday', 20, 0, '', false);
INSERT INTO "mendixsystem$attribute" ("id", "entity_id", "attribute_name", "column_name", "type", "length", "default_value", "is_auto_number") VALUES ('81d80999-c125-4d9b-a8db-b8923d19aead', '84961d08-c37c-4f6a-9ccf-113ab1794aa3', 'Bio', 'bio', 30, 200, '', false);
CREATE TABLE "tasktracker$comment_teammember" (
	"tasktracker$commentid" BIGINT NOT NULL,
	"tasktracker$teammemberid" BIGINT NOT NULL,
	PRIMARY KEY("tasktracker$commentid","tasktracker$teammemberid"),
	CONSTRAINT "uniq_tasktracker$comment_teammember_tasktracker$commentid" UNIQUE ("tasktracker$commentid"));
CREATE INDEX "idx_tasktracker$comment_teammember_tasktracker$teammember_tasktracker$comment" ON "tasktracker$comment_teammember" ("tasktracker$teammemberid" ASC,"tasktracker$commentid" ASC);
INSERT INTO "mendixsystem$association" ("id", "association_name", "table_name", "parent_entity_id", "child_entity_id", "parent_column_name", "child_column_name", "index_name") VALUES ('a5eb1ce4-e7ea-405e-9a16-26346e90eb7c', 'TaskTracker.Comment_TeamMember', 'tasktracker$comment_teammember', '179a6013-87de-4dae-a648-97d8b9d5eef0', '84961d08-c37c-4f6a-9ccf-113ab1794aa3', 'tasktracker$commentid', 'tasktracker$teammemberid', 'idx_tasktracker$comment_teammember_tasktracker$teammember_tasktracker$comment');
INSERT INTO "mendixsystem$unique_constraint" ("name", "table_id", "column_id") VALUES ('uniq_tasktracker$comment_teammember_tasktracker$commentid', 'a5eb1ce4-e7ea-405e-9a16-26346e90eb7c', '917d50fd-1439-3591-9d61-eacd53d2c5be');
UPDATE "mendixsystem$version" SET "versionnumber" = '4.2', "lastsyncdate" = '20230820 14:07:35';
