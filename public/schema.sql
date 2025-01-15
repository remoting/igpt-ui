CREATE TABLE "session" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "subject" TEXT,
  "model" integer,
  "create_time" datetime
);
CREATE TABLE "message" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "sid" integer,
  "question" text,
  "create_time" datetime,
  "answer" text,
  "answer_model" integer,
  "answer_time" datetime,
  "prompt_tokens" integer,
  "completion_tokens" integer,
  "favorite" integer
);
CREATE TABLE "message_b" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "mid" integer,
  "answer" text,
  "answer_model" integer,
  "answer_time" datetime,
  "prompt_tokens" integer,
  "completion_tokens" integer
);
CREATE TABLE "config" (
  "conf_key" TEXT NOT NULL,
  "conf_val" TEXT,
  PRIMARY KEY ("conf_key")
);
CREATE TABLE "model" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" varchar(128),
  "provider" varchar(32) NOT NULL,
  "config" TEXT,
  "default" integer
);