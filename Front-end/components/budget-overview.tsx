// 'use client'

// import { useState, useEffect } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"

// interface Budget {
//   total: number;
//   spent: number;
// }

// export function BudgetOverview() {
//   const [budget, setBudget] = useState<Budget | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchBudget = async () => {
//       try {
//         const response = await fetch('/api/budgets/current')
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }
//         const contentType = response.headers.get("content-type");
//         if (!contentType || !contentType.includes("application/json")) {
//           throw new TypeError("Oops, we haven't got JSON!");
//         }
//         const data = await response.json()
//         setBudget(data)
//       } catch (err) {
//         setError('Failed to load budget: ' + (err instanceof Error ? err.message : String(err)))
//         console.error('Error fetching budget:', err)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchBudget()
//   }, [])

//   if (isLoading) return <Card><CardContent>Loading budget information...</CardContent></Card>
//   if (error) return <Card><CardContent>Error: {error}</CardContent></Card>
//   if (!budget) return <Card><CardContent>No budget data available</CardContent></Card>

//   const percentage = (budget.spent / budget.total) * 100

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Budget Overview</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <div>
//             <div className="flex justify-between mb-1">
//               <span className="text-sm font-medium">Overall Budget</span>
//               <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
//             </div>
//             <Progress value={percentage} className="w-full" />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Total Budget</p>
//               <p className="text-2xl font-bold">${budget.total.toFixed(2)}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Remaining</p>
//               <p className="text-2xl font-bold">${(budget.total - budget.spent).toFixed(2)}</p>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

