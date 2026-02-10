const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-6 w-2/3',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24 rounded-lg',
    card: 'h-32 w-full rounded-lg'
  }

  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${variants[variant]} ${className}`} />
  )
}

export const SkeletonCard = () => (
  <div className="card p-4 space-y-3">
    <Skeleton variant="title" />
    <Skeleton variant="text" />
    <Skeleton variant="text" />
    <div className="flex items-center justify-between mt-4">
      <Skeleton variant="avatar" />
      <Skeleton variant="button" />
    </div>
  </div>
)

export default Skeleton
