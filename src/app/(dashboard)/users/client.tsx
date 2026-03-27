"use client"

import { toast } from "sonner"
import { Trash, MoreHorizontal, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toggleUserRole, deleteUser } from "@/lib/actions/users"
import { DataTable } from "@/components/books/data-table"
import { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserRow = {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
}

const columns: ColumnDef<UserRow>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { 
    accessorKey: "role", 
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={row.original.role === 'admin' ? "default" : "secondary"}>
        {row.original.role}
      </Badge>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
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
                const res = await toggleUserRole(user.id, user.role)
                if (res.error) toast.error(res.error)
                else toast.success("User role updated")
              }}>
                <ShieldAlert className="mr-2 h-4 w-4" /> Toggle Role
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                if (confirm(`Are you sure you want to delete ${user.email}?`)) {
                  const res = await deleteUser(user.id)
                  if (res.error) toast.error(res.error)
                  else toast.success("User deleted")
                }
              }} className="text-destructive focus:text-destructive">
                <Trash className="mr-2 h-4 w-4" /> Delete Access
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

export function UsersClient({ users }: Readonly<{ users: UserRow[] }>) {
  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={users} searchKey="email" />
    </div>
  )
}
