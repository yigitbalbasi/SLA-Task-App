ALTER TABLE "tasktracker$teammember" ADD "department" VARCHAR_IGNORECASE(200) NULL;
INSERT INTO "mendixsystem$attribute" ("id", "entity_id", "attribute_name", "column_name", "type", "length", "default_value", "is_auto_number") VALUES ('6087212e-cb95-4562-946c-55660bfe241b', '84961d08-c37c-4f6a-9ccf-113ab1794aa3', 'Department', 'department', 30, 200, '', false);
CREATE TABLE "tasktracker$teammember_department" (
	"tasktracker$teammemberid" BIGINT NOT NULL,
	"tasktracker$departmentid" BIGINT NOT NULL,
	PRIMARY KEY("tasktracker$teammemberid","tasktracker$departmentid"),
	CONSTRAINT "uniq_tasktracker$teammember_department_tasktracker$teammemberid" UNIQUE ("tasktracker$teammemberid"));
CREATE INDEX "idx_tasktracker$teammember_department_tasktracker$department_tasktracker$teammember" ON "tasktracker$teammember_department" ("tasktracker$departmentid" ASC,"tasktracker$teammemberid" ASC);
INSERT INTO "mendixsystem$association" ("id", "association_name", "table_name", "parent_entity_id", "child_entity_id", "parent_column_name", "child_column_name", "index_name") VALUES ('a390bc29-930f-440b-8a47-a9a862072c96', 'TaskTracker.TeamMember_Department', 'tasktracker$teammember_department', '84961d08-c37c-4f6a-9ccf-113ab1794aa3', 'bde19e81-9775-49e8-b279-2f92884422ae', 'tasktracker$teammemberid', 'tasktracker$departmentid', 'idx_tasktracker$teammember_department_tasktracker$department_tasktracker$teammember');
INSERT INTO "mendixsystem$unique_constraint" ("name", "table_id", "column_id") VALUES ('uniq_tasktracker$teammember_department_tasktracker$teammemberid', 'a390bc29-930f-440b-8a47-a9a862072c96', '97b785f6-2579-360b-8b74-1559970e4256');
UPDATE "mendixsystem$version" SET "versionnumber" = '4.2', "lastsyncdate" = '20230820 15:19:27';
