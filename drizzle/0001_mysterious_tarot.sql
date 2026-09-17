ALTER TABLE "users" ADD COLUMN "username" varchar(20);--> statement-breakpoint
UPDATE "users" SET "username" = 'player-' || substring(replace("id"::text, '-', '') from 1 for 8) WHERE "username" IS NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");
