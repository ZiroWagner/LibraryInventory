import { getCategories } from "@/lib/actions/categories"
import { CategoriesClient } from "./client"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage book categories and classifications.</p>
        </div>
      </div>

      <CategoriesClient categories={categories} />
    </div>
  )
}
