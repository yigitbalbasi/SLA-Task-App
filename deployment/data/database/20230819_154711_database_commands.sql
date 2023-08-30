ALTER TABLE "tasktracker$task" ADD "sladashboardstatus" VARCHAR_IGNORECASE(12) NULL;
ALTER TABLE "tasktracker$task" ADD "completiondate" TIMESTAMP NULL;
INSERT INTO "mendixsystem$attribute" ("id", "entity_id", "attribute_name", "column_name", "type", "length", "default_value", "is_auto_number") VALUES ('38ee26f8-dc80-48cf-bd95-e31cca4fe18f', '06873690-bd7a-452f-a28f-1e1d5331ff61', 'SLADashboardStatus', 'sladashboardstatus', 40, 12, '', false);
INSERT INTO "mendixsystem$attribute" ("id", "entity_id", "attribute_name", "column_name", "type", "length", "default_value", "is_auto_number") VALUES ('d85d0222-a89f-41e5-8775-53daccddcc72', '06873690-bd7a-452f-a28f-1e1d5331ff61', 'CompletionDate', 'completiondate', 20, 0, '', false);
CREATE TABLE "tasktracker$department" (
	"id" BIGINT NOT NULL,
	"name" VARCHAR_IGNORECASE(200) NULL,
	PRIMARY KEY("id"));
INSERT INTO "mendixsystem$entity" ("id", "entity_name", "table_name", "remote", "remote_primary_key") VALUES ('bde19e81-9775-49e8-b279-2f92884422ae', 'TaskTracker.Department', 'tasktracker$department', false, false);
INSERT INTO "mendixsystem$attribute" ("id", "entity_id", "attribute_name", "column_name", "type", "length", "default_value", "is_auto_number") VALUES ('7a4534cc-fdde-4db8-8f11-63563cce5cc0', 'bde19e81-9775-49e8-b279-2f92884422ae', 'Name', 'name', 30, 200, '', false);
CREATE TABLE "tasktracker$task_department" (
	"tasktracker$taskid" BIGINT NOT NULL,
	"tasktracker$departmentid" BIGINT NOT NULL,
	PRIMARY KEY("tasktracker$taskid","tasktracker$departmentid"),
	CONSTRAINT "uniq_tasktracker$task_department_tasktracker$taskid" UNIQUE ("tasktracker$taskid"));
CREATE INDEX "idx_tasktracker$task_department_tasktracker$department_tasktracker$task" ON "tasktracker$task_department" ("tasktracker$departmentid" ASC,"tasktracker$taskid" ASC);
INSERT INTO "mendixsystem$association" ("id", "association_name", "table_name", "parent_entity_id", "child_entity_id", "parent_column_name", "child_column_name", "index_name") VALUES ('678b1ef8-c2f5-4857-a2d3-2dbb8033902e', 'TaskTracker.Task_Department', 'tasktracker$task_department', '06873690-bd7a-452f-a28f-1e1d5331ff61', 'bde19e81-9775-49e8-b279-2f92884422ae', 'tasktracker$taskid', 'tasktracker$departmentid', 'idx_tasktracker$task_department_tasktracker$department_tasktracker$task');
INSERT INTO "mendixsystem$unique_constraint" ("name", "table_id", "column_id") VALUES ('uniq_tasktracker$task_department_tasktracker$taskid', '678b1ef8-c2f5-4857-a2d3-2dbb8033902e', '6ed0988a-0f47-37cc-a76a-40b0f165200b');
UPDATE "mendixsystem$version" SET "versionnumber" = '4.2', "lastsyncdate" = '20230819 15:47:11';
