import { NotificationTable } from "@/components/notification-table"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notifications",
  description: "Notifications",
}

const page = () => {
  return (
    <div >
      <NotificationTable />
    </div>
  )
}

export default page