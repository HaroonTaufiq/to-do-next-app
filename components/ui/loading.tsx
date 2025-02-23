import { Card, CardContent } from "@/components/ui/card"
import { ReloadIcon } from "@radix-ui/react-icons"

interface LoadingProps {
    fullScreen?: boolean
    className?: string
}

export function Loading({ fullScreen = true, className }: LoadingProps) {
    const containerClasses = fullScreen
        ? "flex min-h-screen items-center justify-center bg-background px-4"
        : "flex items-center justify-center bg-background p-4"

    return (
        <div className={containerClasses}>
            <Card className={`w-full max-w-md ${className || ''}`}>
                <CardContent className="flex items-center justify-center py-10">
                    <ReloadIcon className="h-6 w-6 animate-spin" />
                </CardContent>
            </Card>
        </div>
    )
} 