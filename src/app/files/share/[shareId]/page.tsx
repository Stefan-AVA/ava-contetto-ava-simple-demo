"use client"

import {
  useCopySharedFileMutation,
  useGetSharedFileQuery,
  useLazyGetSharedFileQuery,
} from "@/redux/apis/fileshare"

type PageProps = {
  params: {
    shareId: string
  }
  searchParams: {
    orgId: string
    code: string
  }
}

const Page = ({ params, searchParams }: PageProps) => {
  const { shareId } = params
  const { orgId, code } = searchParams

  const { data, isLoading } = useGetSharedFileQuery({
    shareId,
    orgId,
    code,
  })

  const [getDownloadUrl] = useLazyGetSharedFileQuery()
  const [copySharedFile] = useCopySharedFileMutation()

  if (!orgId || !code) return <div>No Content</div>

  return <div>Loading...</div>
}

export default Page
