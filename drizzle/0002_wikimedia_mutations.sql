ALTER TABLE "collections" DROP CONSTRAINT "collections_card_id_cards_id_fk";
ALTER TABLE "cards" ALTER COLUMN "id" TYPE varchar(128);
ALTER TABLE "collections" ALTER COLUMN "card_id" TYPE varchar(128);
ALTER TABLE "collections" ADD CONSTRAINT "collections_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "cards" ADD COLUMN "card_type" varchar(20) DEFAULT 'catalog' NOT NULL;
ALTER TABLE "cards" ADD COLUMN "base_card_id" varchar(128);
ALTER TABLE "cards" ADD COLUMN "mutation" varchar(20);
ALTER TABLE "cards" ADD COLUMN "creator_id" uuid REFERENCES "users"("id") ON DELETE SET NULL;
ALTER TABLE "cards" ADD COLUMN "wikipedia" jsonb;
ALTER TABLE "cards" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;
ALTER TABLE "pack_openings" ADD COLUMN "reason" varchar(32) DEFAULT 'normal' NOT NULL;
CREATE TABLE "card_creation_windows" (
  "user_id" uuid PRIMARY KEY NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "started_at" timestamp with time zone NOT NULL,
  "used" integer DEFAULT 0 NOT NULL
);
