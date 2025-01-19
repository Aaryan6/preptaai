import { Briefcase, type LucideIcon, Target, Users } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

const icons = {
  briefcase: Briefcase,
  users: Users,
  target: Target,
}

interface TopicCardProps {
  icon: keyof typeof icons
  title: string
  description: string
}

export function TopicCard({ icon, title, description }: TopicCardProps) {
  const Icon = icons[icon]

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="flex flex-col items-center p-6 text-center">
        <div className="rounded-full bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mt-4 font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </CardContent>
    </Card>
  )
}

