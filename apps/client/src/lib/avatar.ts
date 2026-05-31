export function getInitials(name: string) {
  if (!name) return ""

  const words = name.trim().split(" ")

  if (words.length === 1) {
    return words[0][0].toUpperCase()
  }

  return (words[0][0] + words[1][0]).toUpperCase()
}

export function getAvatarColor(name: string) {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

export function getAvatarUrl(name: string, avatar?: string) {
  if (avatar) return avatar

  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
}
