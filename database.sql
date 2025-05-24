CREATE TABLE "public"."tbl_user" (
    "id" text NOT NULL,
    "name" text,
    "phone" text NOT NULL,
    "displayname" text,
    "token" text,
    "isremoved" boolean default false,
    "dtcreated" timestamp default now(),
    "dtupdated" timestamp,
    PRIMARY KEY("id")
);


CREATE INDEX "idx_user_phone" ON "public"."tbl_user" ("phone");
CREATE INDEX "idx_user_displayname" ON "public"."tbl_user" ("displayname");

-- CREATE session TABLE
CREATE TABLE "public"."tbl_session" (
    "id" text NOT NULL,
    "userid" text NOT NULL,
    "token" text NOT NULL,
    "dtcreated" timestamp default now(),
    "dtupdated" timestamp,
    PRIMARY KEY("id"),
    FOREIGN KEY("userid") REFERENCES "public"."tbl_user"("id") ON DELETE CASCADE
);