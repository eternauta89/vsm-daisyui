import { ChevronLeft, ChevronRight } from 'lucide-react'

const DEFAULT_PAGES: (number | '…')[] = [1, 2, '…', 20, 21]

type PaginationProps = {
  page: number
  onPageChange: (page: number) => void
  pages?: (number | '…')[]
}

export default function Pagination({
  page,
  onPageChange,
  pages = DEFAULT_PAGES,
}: PaginationProps) {
  const maxPage = Math.max(
    ...pages.filter((item): item is number => typeof item === 'number'),
  )

  return (
    <div className="join">
      <button
        type="button"
        className="join-item btn"
        aria-label="Página anterior"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((item, index) =>
        item === '…' ? (
          <button
            key={`ellipsis-${index}`}
            type="button"
            className="join-item btn btn-disabled"
          >
            …
          </button>
        ) : (
          <button
            key={item}
            type="button"
            className={`join-item btn ${page === item ? 'btn-active' : ''}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        className="join-item btn"
        aria-label="Página siguiente"
        disabled={page >= maxPage}
        onClick={() => onPageChange(Math.min(maxPage, page + 1))}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}
