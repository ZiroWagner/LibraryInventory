"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  })
}

export async function toggleUserRole(id: string, currentRole: string) {
  try {
    const newRole = currentRole === 'admin' ? 'librarian' : 'admin'
    await prisma.user.update({ where: { id }, data: { role: newRole } })
    revalidatePath('/users')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to update user role' }
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } })
    revalidatePath('/users')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete user' }
  }
}
