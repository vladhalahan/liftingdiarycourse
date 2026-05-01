import { integer, numeric, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const workouts = pgTable("workouts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  startedAt: timestamp("started_at").notNull(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const exercises = pgTable("exercises", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  workoutId: uuid("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const workoutsRelations = relations(workouts, ({ many }) => ({
  exercises: many(exercises),
}));

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [exercises.workoutId],
    references: [workouts.id],
  }),
  sets: many(sets),
}));

export const sets = pgTable("sets", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),
  setNumber: integer("set_number").notNull(),
  weightKg: numeric("weight_kg", { precision: 6, scale: 2 }),
  reps: integer("reps"),
  rpe: numeric("rpe", { precision: 3, scale: 1 }),
  setType: varchar("set_type", { length: 20 }).default("normal"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const setsRelations = relations(sets, ({ one }) => ({
  exercise: one(exercises, {
    fields: [sets.exerciseId],
    references: [exercises.id],
  }),
}));