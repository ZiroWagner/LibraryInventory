import { getDashboardStats, getLowStockBooks } from "@/lib/actions/dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookAIcon, UsersIcon, AlertTriangleIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const lowStockBooks = await getLowStockBooks(5)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookAIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">In our inventory system</p>
          </CardContent>
        </Card>
        
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockBooks}</div>
            <p className="text-xs text-muted-foreground">Books with ≤ 2 copies available</p>
          </CardContent>
        </Card>
        
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered in the system</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader>
            <CardTitle>Low Stock Books</CardTitle>
            <CardDescription>
              Items that need to be restocked soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Available</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {lowStockBooks.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">No low stock items</td>
                    </tr>
                  ) : (
                    lowStockBooks.map(book => (
                      <tr key={book.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium">{book.title}</td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline">{book.category?.name}</Badge>
                        </td>
                        <td className="p-4 align-middle flex items-center gap-2">
                          {book.availableStock === 0 ? (
                            <Badge variant="destructive">Out of stock</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-orange-500">{book.availableStock}</Badge>
                          )}
                        </td>
                        <td className="p-4 align-middle">{book.stock}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
