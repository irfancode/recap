import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const bookmarkSchema = z.object({
  url: z.string().url("Invalid URL"),
  title: z.string().optional(),
  description: z.string().optional(),
  collectionId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  note: z.string().optional(),
  isFavorite: z.boolean().optional(),
  isRead: z.boolean().optional(),
})

export const collectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  parentId: z.string().optional().nullable(),
  icon: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
})

export const aiSettingsSchema = z.object({
  provider: z.enum(["ollama", "openai", "anthropic"]),
  model: z.string(),
  apiKey: z.string().optional(),
  apiUrl: z.string().optional(),
  autoTag: z.boolean().optional(),
  summarize: z.boolean().optional(),
})
