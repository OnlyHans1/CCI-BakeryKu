export const API_URL = process.env.NEXT_PUBLIC_API_URL

export function assetUrl(path: string | undefined | null): string {
  if (!path) return "/placeholder.jpg"
  if (path.startsWith("http")) return path
  return `${API_URL}${path}`
}
