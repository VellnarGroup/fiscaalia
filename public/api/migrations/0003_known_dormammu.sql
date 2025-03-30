CREATE TABLE "usersToRoles" (
	"databaseId" uuid NOT NULL,
	"roleId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "usersToRoles_databaseId_roleId_userId_pk" PRIMARY KEY("databaseId","roleId","userId")
);

ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_databaseId_databases_id_fk" FOREIGN KEY ("databaseId") REFERENCES "public"."databases"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_roleId_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;