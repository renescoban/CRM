'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Order } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp } from 'lucide-react'

interface OrderTableProps {
  orders: Order[]
}

type SortKey = 'id' | 'total' | 'status' | 'created_at'
type SortOrder = 'asc' | 'desc'

export default function OrderTable({ orders }: OrderTableProps) {
  const [groupBy, setGroupBy] = useState<'status' | 'none'>('none')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'total', 'status', 'created_at'])
  const [searchTerm, setSearchTerm] = useState('')

  const groupedAndSortedOrders = useMemo(() => {
    let filteredOrders = orders.filter(order => 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.contacts?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    let grouped = groupBy === 'none' 
      ? { 'All Orders': filteredOrders } 
      : filteredOrders.reduce((groups, order) => {
          const key = order[groupBy]
          if (!groups[key]) {
            groups[key] = []
          }
          groups[key].push(order)
          return groups
        }, {} as Record<string, Order[]>)

    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1
        if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    })

    return grouped
  }, [orders, groupBy, sortKey, sortOrder, searchTerm])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => 
      prev.includes(column) 
        ? prev.filter(col => col !== column)
        : [...prev, column]
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div>
          <Label htmlFor="groupBy">Group By</Label>
          <Select value={groupBy} onValueChange={(value: 'status' | 'none') => setGroupBy(value)}>
            <SelectTrigger id="groupBy">
              <SelectValue placeholder="Select grouping" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label>Visible Columns</Label>
          <div className="flex gap-2">
            {['id', 'total', 'status', 'created_at'].map(column => (
              <Button
                key={column}
                variant={visibleColumns.includes(column) ? 'default' : 'outline'}
                onClick={() => toggleColumn(column)}
              >
                {column}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {Object.entries(groupedAndSortedOrders).map(([group, groupOrders]) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle>{group}</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr>
                  {visibleColumns.includes('id') && (
                    <th className="text-left">
                      <Button variant="ghost" onClick={() => toggleSort('id')}>
                        ID {sortKey === 'id' && (sortOrder === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                      </Button>
                    </th>
                  )}
                  {visibleColumns.includes('total') && (
                    <th className="text-left">
                      <Button variant="ghost" onClick={() => toggleSort('total')}>
                        Total {sortKey === 'total' && (sortOrder === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                      </Button>
                    </th>
                  )}
                  {visibleColumns.includes('status') && (
                    <th className="text-left">
                      <Button variant="ghost" onClick={() => toggleSort('status')}>
                        Status {sortKey === 'status' && (sortOrder === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                      </Button>
                    </th>
                  )}
                  {visibleColumns.includes('created_at') && (
                    <th className="text-left">
                      <Button variant="ghost" onClick={() => toggleSort('created_at')}>
                        Created At {sortKey === 'created_at' && (sortOrder === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                      </Button>
                    </th>
                  )}
                  <th className="text-left">Customer</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupOrders.map((order) => (
                  <tr key={order.id}>
                    {visibleColumns.includes('id') && <td>{ order.products.map( (product) => product.name ) }</td>}
                    {visibleColumns.includes('total') && <td>${order.total.toFixed(2)}</td>}
                    {visibleColumns.includes('status') && (
                      <td>
                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </td>
                    )}
                    {visibleColumns.includes('created_at') && <td>{new Date(order.created_at).toLocaleDateString()}</td>}
                    <td>{order.contacts?.name}</td>
                    <td>
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="link">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

