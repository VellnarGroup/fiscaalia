CREATE TABLE "users" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"databaseId" uuid,
	"password" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_databaseId_pk" PRIMARY KEY("email","databaseId")
);

ALTER TABLE "users" ADD CONSTRAINT "users_databaseId_databases_id_fk" FOREIGN KEY ("databaseId") REFERENCES "public"."databases"("id") ON DELETE no action ON UPDATE no action;
CREATE UNIQUE INDEX "users_id_index" ON "users" USING btree ("id");