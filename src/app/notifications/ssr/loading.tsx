import { Skeleton } from '@/components/ui/skeleton'

const Loading = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[200px]" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-[130px]" />
          <Skeleton className="h-9 w-[150px]" />
        </div>
      </div>
      <div className="rounded-md border">
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  )
}

export default Loading
