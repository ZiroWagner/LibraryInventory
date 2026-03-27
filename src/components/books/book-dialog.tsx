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
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { BookForm } from "./book-form"

interface BookDialogProps {
  categories: { id: string; name: string }[]
  book?: (BookFormData & { id: string }) | null
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function BookDialog({ categories, book, children, open, onOpenChange }: BookDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const isOpen = open !== undefined ? open : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children ? (
        <DialogTrigger render={children as any} />
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
