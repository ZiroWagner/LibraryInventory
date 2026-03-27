import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
  const [totalBooks, totalUsers, lowStockBooks] = await Promise.all([
    prisma.book.count(),
    prisma.user.count(),
    prisma.book.count({
      where: {
        availableStock: {
          lte: 2
        }
      }
    })
  ])

  return {
    totalBooks,
    totalUsers,
    lowStockBooks,
  }
}

export async function getLowStockBooks(limit = 5) {
  return prisma.book.findMany({
    where: {
      availableStock: {
        lte: 2
      }
    },
    take: limit,
    orderBy: {
      availableStock: 'asc'
    },
    include: {
      category: true
    }
  })
}
