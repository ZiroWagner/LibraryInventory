"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { deleteBook } from "@/lib/actions/books"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, ArrowUpDown } from "lucide-react"

import { useState } from "react"
import { getCategories } from "@/lib/actions/books"
import { BookDialog } from "./book-dialog"

export type BookRow = {
  id: string
  title: string
  author: string
  publishedYear: number
  stock: number
  availableStock: number
  publisher: string | null
  location: string | null
  coverUrl: string | null
  categoryId: string | null
  category: { id: string; name: string } | null
}

const ActionCell = ({ book }: { book: BookRow }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={(e) => { e.preventDefault(); setIsDetailOpen(true); }}>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(book.id)}>
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async (e) => { 
              e.preventDefault(); 
              const cats = await getCategories()
              setCategories(cats)
              setIsEditOpen(true)
            }}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={async () => { 
                if (confirm("Are you sure you want to delete this book?")) {
                  const res = await deleteBook(book.id)
                  if (!res.error) toast.success("Book deleted")
                  else toast.error("Failed to delete")
                }
              }} 
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Book Details</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row gap-6 py-4">
            <div className="w-full md:w-1/3 shrink-0">
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} className="w-full rounded-md object-cover shadow-sm aspect-[3/4]" />
              ) : (
                <div className="w-full aspect-[3/4] bg-muted flex items-center justify-center rounded-md shadow-sm">
                  <span className="text-muted-foreground text-sm">No cover</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 w-full md:w-2/3">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right">Title:</span>
                <span className="col-span-3 text-muted-foreground">{book.title}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right">Author:</span>
                <span className="col-span-3 text-muted-foreground">{book.author}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right">Year:</span>
                <span className="col-span-3 text-muted-foreground">{book.publishedYear}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right">Category:</span>
                <span className="col-span-3">
                  <Badge variant="outline">{book.category?.name || 'N/A'}</Badge>
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right">Stock:</span>
                <span className="col-span-3 text-muted-foreground">
                  {book.availableStock} available / {book.stock} total
                </span>
              </div>
              {book.publisher && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-semibold text-right">Publisher:</span>
                  <span className="col-span-3 text-muted-foreground">{book.publisher}</span>
                </div>
              )}
              {book.location && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-semibold text-right">Location:</span>
                  <span className="col-span-3 text-muted-foreground">{book.location}</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BookDialog 
        categories={categories} 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen}
        book={{
          ...book,
          categoryId: book.categoryId || "",
          publisher: book.publisher || undefined,
          location: book.location || undefined,
          coverUrl: book.coverUrl || undefined,
        }}
      />
    </>
  )
}

export const columns: ColumnDef<BookRow>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "author",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Author
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => {
      const cat = row.original.category?.name
      return cat ? <Badge variant="outline">{cat}</Badge> : null
    }
  },
  {
    accessorKey: "publishedYear",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    filterFn: (row, id, value) => {
      return String(row.getValue(id)).includes(String(value))
    }
  },
  {
    accessorKey: "availableStock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const available = row.getValue("availableStock") as number
      const total = row.original.stock
      if (available === 0) {
        return <Badge variant="destructive">Out of Stock</Badge>
      }
      if (available <= 2) {
        return <Badge variant="secondary" className="text-orange-500">Low Stock ({available}/{total})</Badge>
      }
      return <Badge className="bg-green-500 hover:bg-green-600">Available ({available}/{total})</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell book={row.original} />
  },
]
