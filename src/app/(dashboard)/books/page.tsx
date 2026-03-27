import { getBooks, getCategories } from "@/lib/actions/books"
import { DataTable } from "@/components/books/data-table"
import { columns } from "@/components/books/columns"
import { BookDialog } from "@/components/books/book-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function BooksPage() {
  const [books, categories] = await Promise.all([
    getBooks(),
    getCategories()
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Books</h1>
          <p className="text-muted-foreground">Manage your library&apos;s book inventory.</p>
        </div>
        <BookDialog categories={categories}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </BookDialog>
      </div>

      <DataTable 
        columns={columns} 
        data={books} 
        filterableColumns={[
          { id: 'title', title: 'Title' },
          { id: 'author', title: 'Author' },
          { id: 'publishedYear', title: 'Year', type: 'number' }
        ]}
      />
    </div>
  )
}
