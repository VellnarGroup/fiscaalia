CREATE TABLE "roles" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"databaseId" uuid,
	"permissions" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_databaseId_pk" PRIMARY KEY("name","databaseId")
);

ALTER TABLE "roles" ADD CONSTRAINT "roles_databaseId_databases_id_fk" FOREIGN KEY ("databaseId") REFERENCES "public"."databases"("id") ON DELETE no action ON UPDATE no action;
CREATE UNIQUE INDEX "roles_id_index" ON "roles" USING btree ("id");