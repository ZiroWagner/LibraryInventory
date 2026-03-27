"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

export type CategoryFormData = z.infer<typeof categorySchema>

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { books: true }
      }
    }
  })
}

export async function createCategory(data: CategoryFormData) {
  const parsed = categorySchema.safeParse(data)
  if (!parsed.success) return { error: 'Invalid data' }

  try {
    await prisma.category.create({ data: parsed.data })
    revalidatePath('/categories')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to create category' }
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if category has books
    const hasBooks = await prisma.book.findFirst({ where: { categoryId: id } })
    if (hasBooks) {
      return { error: 'Cannot delete category with associated books' }
    }
    await prisma.category.delete({ where: { id } })
    revalidatePath('/categories')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete category' }
  }
}
