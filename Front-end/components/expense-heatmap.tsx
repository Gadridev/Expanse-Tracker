'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveContainer, Tooltip, XAxis, YAxis, ScatterChart, Scatter, Cell } from 'recharts'
import { subWeeks, format, startOfWeek, addDays } from 'date-fns'

// Utility function to generate mock data
const generateMockData = (startDate: Date) => {
  const data = []
  for (let i = 0; i < 7; i++) {
    const day = addDays(startDate, i)
    for (let hour = 0; hour < 24; hour++) {
      data.push({
        day: format(day, 'EEE'),
        fullDate: format(day, 'yyyy-MM-dd'),
        hour,
        value: Math.floor(Math.random() * 100)
      })
    }
  }
  return data
}

const colorScale = [
  '#ffedea', '#ffcec5', '#ffad9f', '#ff8a75', '#ff5533', 
  '#e2492d', '#be3d26', '#9a311f', '#782618'
]

const getColor = (value: number, max: number) => {
  const index = Math.min(Math.floor((value / max) * colorScale.length), colorScale.length - 1)
  return colorScale[index]
}

export function ExpenseHeatmap() {
  const [selectedWeek, setSelectedWeek] = useState<number>(0)
  
  const weeks = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      value: i,
      label: `Week ${i + 1}: ${format(subWeeks(new Date(), i), 'MMM d')} - ${format(subWeeks(new Date(), i - 1), 'MMM d')}`
    })).reverse()
  }, [])

  const data = useMemo(() => {
    const startDate = startOfWeek(subWeeks(new Date(), selectedWeek))
    return generateMockData(startDate)
  }, [selectedWeek])

  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Expense Heatmap</CardTitle>
          <Select 
            value={selectedWeek.toString()} 
            onValueChange={(value) => setSelectedWeek(Number(value))}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {weeks.map((week) => (
                <SelectItem key={week.value} value={week.value.toString()}>
                  {week.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
            >
              <XAxis 
                type="number" 
                dataKey="hour" 
                name="Hour" 
                domain={[0, 23]}
                tickFormatter={(hour) => `${hour}:00`}
                label={{ value: 'Hour of Day', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="category" 
                dataKey="day" 
                name="Day" 
                tickFormatter={(day) => day.substring(0, 1)}
                label={{ value: 'Day of Week', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border rounded shadow">
                        <p className="font-semibold">{data.fullDate}</p>
                        <p>Time: {data.hour}:00</p>
                        <p>Expense: ${data.value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={data} shape="square">
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getColor(entry.value, maxValue)}
                    width={20}
                    height={20}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-center items-center space-x-2">
          <span className="text-sm font-medium">Less</span>
          {colorScale.map((color, index) => (
            <div 
              key={index} 
              className="w-6 h-6" 
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="text-sm font-medium">More</span>
        </div>
      </CardContent>
    </Card>
  )
}

