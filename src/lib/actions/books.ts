"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { bookSchema, BookFormData } from "@/lib/schemas/books"

export async function getBooks() {
  return prisma.book.findMany({
    include: { category: true },
    orderBy: { title: 'asc' }
  })
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' }
  })
}

export async function createBook(data: BookFormData) {
  const parsed = bookSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Invalid data', details: parsed.error.issues }
  }

  const { stock, ...rest } = parsed.data

  try {
    await prisma.book.create({
      data: {
        ...rest,
        stock,
        availableStock: stock,
        coverUrl: rest.coverUrl || null,
        publisher: rest.publisher || null,
        location: rest.location || null,
      }
    })
    revalidatePath('/books')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to create book' }
  }
}

export async function updateBook(id: string, data: BookFormData) {
  const parsed = bookSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Invalid data', details: parsed.error.issues }
  }

  try {
    const existing = await prisma.book.findUnique({ where: { id } })
    if (!existing) return { error: 'Book not found' }

    const stockDiff = parsed.data.stock - existing.stock
    const newAvailableStock = Math.max(0, existing.availableStock + stockDiff)

    await prisma.book.update({
      where: { id },
      data: {
        ...parsed.data,
        availableStock: newAvailableStock,
        coverUrl: parsed.data.coverUrl || null,
        publisher: parsed.data.publisher || null,
        location: parsed.data.location || null,
      }
    })
    revalidatePath('/books')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to update book' }
  }
}

export async function deleteBook(id: string) {
  try {
    await prisma.book.delete({ where: { id } })
    revalidatePath('/books')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to delete book' }
  }
}
