"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createBook, updateBook } from "@/lib/actions/books"
import { bookSchema, BookFormData } from "@/lib/schemas/books"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BookFormProps {
  book?: (BookFormData & { id: string }) | null
  categories: { id: string; name: string }[]
  onSuccess: () => void
}

export function BookForm({ book, categories, onSuccess }: BookFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<BookFormData>({
    resolver: zodResolver(bookSchema) as any,
    defaultValues: book ? {
      title: book.title,
      author: book.author,
      publishedYear: book.publishedYear,
      categoryId: book.categoryId,
      stock: book.stock,
      publisher: book.publisher || "",
      location: book.location || "",
      coverUrl: book.coverUrl || "",
    } : {
      title: "",
      author: "",
      publishedYear: new Date().getFullYear(),
      categoryId: "",
      stock: 1,
      publisher: "",
      location: "",
      coverUrl: "",
    }
  })

  async function onSubmit(values: BookFormData) {
    setIsLoading(true)
    try {
      const res = book 
        ? await updateBook(book.id, values)
        : await createBook(values)

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(book ? "Book updated successfully" : "Book added successfully")
        onSuccess()
      }
    } catch (e) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input id="author" {...form.register("author")} />
          {form.formState.errors.author && (
            <p className="text-sm text-destructive">{form.formState.errors.author.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select 
            id="categoryId" 
            {...form.register("categoryId")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="">Select a category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {form.formState.errors.categoryId && (
            <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="publishedYear">Year</Label>
          <Input id="publishedYear" type="number" {...form.register("publishedYear")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Total Stock</Label>
          <Input id="stock" type="number" {...form.register("stock")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location (Shelf)</Label>
          <Input id="location" {...form.register("location")} />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="publisher">Publisher</Label>
          <Input id="publisher" {...form.register("publisher")} />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="coverUrl">Cover Image URL</Label>
          <Input id="coverUrl" {...form.register("coverUrl")} />
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : (book ? "Save Changes" : "Add Book")}
        </Button>
      </div>
    </form>
  )
}
