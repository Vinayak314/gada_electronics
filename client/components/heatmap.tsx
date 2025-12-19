"use client"

import { useEffect, useState } from "react"
import { format, subDays, eachDayOfInterval, isSameDay } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Submission {
    creationTimeSeconds: number
    verdict: string
}

interface CodeforcesHeatmapProps {
    handle: string
}

export function CodeforcesHeatmap({ handle }: CodeforcesHeatmapProps) {
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`)
                const data = await res.json()
                if (data.status === "OK") {
                    // We only care about creationTimeSeconds and if it's OK? 
                    // Actually, for heatmap, usually any submission counts, or maybe only Accepted. 
                    // GitHub counts commits. CF usually counts accepted problems or just activity.
                    // Let's count all submissions to show "activity".
                    setSubmissions(data.result)
                }
            } catch (error) {
                console.error("Failed to fetch CF submissions", error)
            } finally {
                setLoading(false)
            }
        }

        if (handle) {
            fetchSubmissions()
        }
    }, [handle])

    if (loading) return <div className="text-white/50 text-xs">Loading heatmap...</div>

    // Generate last 365 days
    const today = new Date()
    const days = eachDayOfInterval({
        start: subDays(today, 364),
        end: today,
    })

    // Map submissions to counts
    const submissionCounts = new Map<string, number>()
    submissions.forEach(sub => {
        const dateStr = format(new Date(sub.creationTimeSeconds * 1000), 'yyyy-MM-dd')
        submissionCounts.set(dateStr, (submissionCounts.get(dateStr) || 0) + 1)
    })

    // Determine intensity color
    const getColor = (count: number) => {
        if (count === 0) return "bg-white/5"
        if (count <= 2) return "bg-green-900/40"
        if (count <= 5) return "bg-green-700/60"
        if (count <= 10) return "bg-green-500/80"
        return "bg-green-400"
    }

    // Weeks calculation for grid
    // We need to group days by weeks (Sunday to Saturday or Mon-Sun)
    // GitHub uses 7 rows (days of week) and N columns (weeks)

    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="flex gap-1 min-w-[max-content]">
                {/* We can construct columns. Each column is a week. */}
                {/* But simple way: just map days and use grid-rows-7 grid-flow-col */}
                <div className="grid grid-rows-7 grid-flow-col gap-[2px]">
                    {days.map((day) => {
                        const dateStr = format(day, 'yyyy-MM-dd')
                        const count = submissionCounts.get(dateStr) || 0
                        return (
                            <TooltipProvider key={dateStr}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className={`h-3 w-3 rounded-[1px] ${getColor(count)}`} />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 border-white/10 text-xs text-white">
                                        {count} submissions on {format(day, 'MMM d, yyyy')}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )
                    })}
                </div>
            </div>
            <div className="mt-2 flex items-center justify-end gap-2 text-[10px] text-white/40">
                <span>Less</span>
                <div className="flex gap-[2px]">
                    <div className="h-[10px] w-[10px] rounded-[2px] bg-white/5" />
                    <div className="h-[10px] w-[10px] rounded-[2px] bg-green-900/40" />
                    <div className="h-[10px] w-[10px] rounded-[2px] bg-green-700/60" />
                    <div className="h-[10px] w-[10px] rounded-[2px] bg-green-500/80" />
                    <div className="h-[10px] w-[10px] rounded-[2px] bg-green-400" />
                </div>
                <span>More</span>
            </div>
        </div>
    )
}
