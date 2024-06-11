import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
const sql = neon('postgresql://expense_DB_owner:1NbyGoCEmWq4@ep-silent-recipe-a51iai0w.us-east-2.aws.neon.tech/expense_DB?sslmode=require');
export const DB = drizzle(sql, {schema});