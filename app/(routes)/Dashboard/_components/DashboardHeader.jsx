import { UserButton } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react'
import debounce from 'lodash.debounce'

function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Function to handle the search logic
  const handleSearch = (query) => {
    console.log('Searching for:', query)
    // Implement your search logic here
    const searchResults = []
  }

  // Debounce the search function to prevent too many calls
  const debouncedSearch = debounce(handleSearch, 300)

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery)
    }
    // Cleanup the debounce function on component unmount
    return () => {
      debouncedSearch.cancel()
    }
  }, [searchQuery])

  return (
    <div className='p-5 shadow-sm border-b flex justify-between'> 
      <div>
        <input
          type='text'
          placeholder='Search...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='px-4 py-2 border rounded'
        />
      </div>
      <div>
        <UserButton />
      </div>
    </div>
  )
}

export default DashboardHeader
