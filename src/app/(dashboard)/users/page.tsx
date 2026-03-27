import { getUsers } from "@/lib/actions/users"
import { UsersClient } from "./client"

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage administrative access and librarian accounts.</p>
        </div>
      </div>
      <UsersClient users={users} />
    </div>
  )
}
