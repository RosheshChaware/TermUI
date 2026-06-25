import { Star } from "lucide-react"

function formatStarCount(count: number, locales?: Intl.LocalesArgument): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return count.toLocaleString(locales)
}

interface GitHubStarsProps {
  repo: string
  stargazersCount: number
  locales?: Intl.LocalesArgument
  className?: string
}

export function GitHubStars({ repo, stargazersCount, locales, className }: GitHubStarsProps) {
  const formatted = formatStarCount(stargazersCount, locales)
  const full = stargazersCount.toLocaleString(locales)

  return (
    <a
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={`${full} stars on GitHub`}
    >
      <Star size={14} style={{ marginTop: '-1px' }} />
      <span>{formatted}</span>
    </a>
  )
}
