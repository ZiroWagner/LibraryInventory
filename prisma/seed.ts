import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcrypt'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

const CATEGORIES = [
  { name: 'Science Fiction', description: 'Explore the future and outer space' },
  { name: 'Fantasy', description: 'Magic, swords, and mythological creatures' },
  { name: 'Mystery', description: 'Crime, detectives, and suspense' },
  { name: 'Romance', description: 'Love stories and emotional journeys' },
  { name: 'Non-Fiction', description: 'History, science, and biographies' }
]

const ADJECTIVES = ["The Dark", "A New", "Lost", "Silent", "Hidden", "Final", "First", "Eternal", "Frozen", "Golden", "Broken", "Crimson"];
const NOUNS = ["World", "Star", "City", "Ocean", "Journey", "Sword", "Secret", "Throne", "Mind", "Heart", "Time", "Shadow"];
const SUFFIXES = ["of Magic", "in the Night", "of the Gods", "Reborn", "Awakening", "and the King", "Chronicles", "Part I", "Part II", "Ascension"];
const AUTHORS = ["John Doe", "Jane Smith", "Alice Johnson", "Robert Brown", "Emily White", "Michael Green", "Sarah Black", "William Hall", "Jessica Adams", "David King", "Oscar Wilde", "Ursula K. Le Guin", "Isaac Asimov", "Agatha Christie"];
const PUBLISHERS = ["Penguin", "HarperCollins", "Macmillan", "Simon & Schuster", "Hachette", "Oxford University Press", "Vintage Books", "Tor Books", "Orbit"];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log('Starting exact data seeding...')

  // 1. Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@library.com' },
    update: {
      password: adminPassword,
      role: 'admin',
    },
    create: {
      email: 'admin@library.com',
      name: 'System Admin',
      password: adminPassword,
      role: 'admin',
    },
  })
  console.log('✅ Admin user ensured: admin@library.com / admin123')

  // 2. Categories
  const categoryRecords = []
  for (const cat of CATEGORIES) {
    const record = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    })
    categoryRecords.push(record)
  }
  console.log(`✅ ${categoryRecords.length} Categories ensured.`)

  // 3. Books
  await prisma.book.deleteMany({})
  console.log('✅ Cleared previous books to ensure fresh 100+ population.')

  const booksToCreate = []

  for (let i = 0; i < 125; i++) {
    const title = `${getRandomItem(ADJECTIVES)} ${getRandomItem(NOUNS)} ${getRandomItem(SUFFIXES)}`
    const stock = Math.floor(Math.random() * 8) + 1; // 1 to 8 copies
    const availableStock = Math.random() > 0.8 ? Math.floor(Math.random() * stock) : stock; // Sometimes some are checked out
    const category = getRandomItem(categoryRecords);

    booksToCreate.push({
      title: `${title} (Vol ${i+1})`,
      author: getRandomItem(AUTHORS),
      publishedYear: Math.floor(Math.random() * 50) + 1974, // 1974 to 2023
      publisher: getRandomItem(PUBLISHERS),
      stock: stock,
      availableStock: availableStock,
      location: `Floor ${Math.floor(Math.random() * 4) + 1}, Shelf ${String.fromCodePoint(65 + Math.floor(Math.random() * 10))}`,
      categoryId: category.id,
      coverUrl: `https://picsum.photos/seed/${i + 1500}/300/400`
    })
  }

  const createdBooks = await prisma.book.createMany({
    data: booksToCreate
  })

  console.log(`✅ ${createdBooks.count} Books successfully created.`)
  
  // Optional: create some low stock items guaranteed
  if (createdBooks.count > 0) {
     const someBook = await prisma.book.findFirst();
     if (someBook) {
       await prisma.book.update({
         where: { id: someBook.id },
         data: { stock: 1, availableStock: 0 }
       })
       console.log('✅ Ensured at least one book is out of stock for testing.')
     }
  }

  console.log('\n--- SEEDING COMPLETE ---')
  console.log('Credentials for functional testing:')
  console.log('Email: admin@library.com')
  console.log('Password: admin123')
  console.log('Total Books inserted:', createdBooks.count)
}

try {
  await main()
} catch (e) {
  console.error(e)
  process.exit(1)
} finally {
  await prisma.$disconnect()
}
