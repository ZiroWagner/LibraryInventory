"use client"

import { useState } from "react"
import { BookFormData } from "@/lib/schemas/books"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookForm } from "./book-form"

interface BookDialogProps {
  categories: { id: string; name: string }[]
  book?: (BookFormData & { id: string }) | null
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function BookDialog({ categories, book, children, open, onOpenChange }: Readonly<BookDialogProps>) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const isOpen = open ?? internalOpen
  const setIsOpen = onOpenChange ?? setInternalOpen

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children ? (
        <DialogTrigger render={children as React.ReactElement} />
      ) : null}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
        </DialogHeader>
        <BookForm 
          categories={categories} 
          book={book} 
          onSuccess={() => setIsOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  )
}
