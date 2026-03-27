"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { PlusCircle, Trash, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { createCategory, deleteCategory } from "@/lib/actions/categories"
import { DataTable } from "@/components/books/data-table"
import { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

type CategoryRow = {
  id: string
  name: string
  description: string | null
  _count: { books: number }
}

const columns: ColumnDef<CategoryRow>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "description", header: "Description" },
  { 
    accessorKey: "_count.books", 
    header: "Books Count",
    cell: ({ row }) => <Badge variant="secondary">{row.original._count.books} books</Badge>
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          } />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={async () => {
                if (confirm("Delete this category?")) {
                  const res = await deleteCategory(category.id)
                  if (res.error) toast.error(res.error)
                  else toast.success("Category deleted")
                }
              }} className="text-destructive">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

export function CategoriesClient({ categories }: Readonly<{ categories: CategoryRow[] }>) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "" }
  })

  async function onSubmit(values: z.infer<typeof categorySchema>) {
    setIsLoading(true)
    const res = await createCategory(values)
    setIsLoading(false)
    if (res.error) toast.error(res.error)
    else {
      toast.success("Category created")
      setIsOpen(false)
      form.reset()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Category</Button>
          } />
          <DialogContent>
            <DialogHeader><DialogTitle>New Category</DialogTitle></DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input {...form.register("name")} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input {...form.register("description")} />
              </div>
              <Button type="submit" disabled={isLoading}>Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={categories} searchKey="name" />
    </div>
  )
}
