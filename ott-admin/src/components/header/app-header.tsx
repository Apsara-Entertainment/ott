import { UserCircle2 } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";

export function AppHeader() {
  return (
    <div className="flex items-center justify-between p-4 border-b mb-4 sticky top-0 bg-slate-800 text-white">
      <div>
        <SidebarTrigger className="scale-150" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      </div>
      <div>
        <span className="bg-slate-500 text-white text-lg rounded-full px-3 py-2 mr-2">
          G
        </span>
      </div>
    </div>
  )
}
