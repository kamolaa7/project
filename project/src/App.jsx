import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState([])
  const [newItem, setNewItem] = useState({ id: '', name: '', description: '', price: '', message: '' })
  const [editingItem, setEditingItem] = useState(null)
  // Use RAILWAY_API_URL environment variable for Railway deployment  
  const API_URL = import.meta.env.VITE_RAILWAY_API_URL || 'http://localhost:3001'

  // CRUD Operations - HTTP Requests:
  
  // READ: Fetch all data items (HTTP GET)
  // GET /api/data - Retrieves all items from the database
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/data`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // CREATE: Add new data item (HTTP POST)
  // POST /api/data - Creates a new item in the database
  const createItem = async (event) => {
    event.preventDefault()
    
    // Validate all fields are filled
    if (!newItem.id.trim() || !newItem.name.trim() || !newItem.description.trim() || !newItem.price.trim() || !newItem.message.trim()) {
      alert('Please fill in all fields before saving.')
      return
    }
    
    console.log('API_URL:', API_URL)
    console.log('Sending data:', { id: newItem.id, data: { name: newItem.name, description: newItem.description, price: newItem.price, message: newItem.message } })
    
    try {
      const response = await fetch(`${API_URL}/api/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newItem.id,
          data: { name: newItem.name, description: newItem.description, price: newItem.price, message: newItem.message }
        })
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('Success response:', responseData)
        setNewItem({ id: '', name: '', description: '', price: '', message: '' })
        fetchData()
      } else {
        const errorData = await response.text()
        console.error('Error response:', errorData)
        alert(`Error saving item: ${response.status} - ${errorData}`)
      }
    } catch (error) {
      console.error('Network error creating item:', error)
      alert(`Network error: ${error.message}`)
    }
  }

  // UPDATE: Modify existing data item (HTTP PUT)
  // PUT /api/data/:id - Updates an existing item by ID in the database
  const updateItem = async (event) => {
    event.preventDefault()
    
    // Validate all fields are filled
    if (!editingItem.name.trim() || !editingItem.description.trim() || !editingItem.price.trim() || !editingItem.message.trim()) {
      alert('Please fill in all fields before saving.')
      return
    }
    
    try {
      const response = await fetch(`${API_URL}/api/data/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: { name: editingItem.name, description: editingItem.description, price: editingItem.price, message: editingItem.message }
        })
      })
      if (response.ok) {
        setEditingItem(null)
        fetchData()
      }
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  // DELETE: Remove data item (HTTP DELETE)
  // DELETE /api/data/:id - Deletes an item by ID from the database
  const deleteItem = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/data/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold font-mono mb-8 text-green-800">BrandAid</h1>
      
      {/* Create Item Form with Message */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl mb-8 shadow-lg border border-blue-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-600">
          Your Research Assistant 
        </h2>
        
        <form onSubmit={createItem} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Item ID"
              value={newItem.id}
              onChange={(event) => setNewItem({...newItem, id: event.target.value})}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(event) => setNewItem({...newItem, name: event.target.value})}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(event) => setNewItem({...newItem, description: event.target.value})}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(event) => setNewItem({...newItem, price: event.target.value})}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>
          
          {/* Message Text Box */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={newItem.message}
              onChange={(event) => setNewItem({...newItem, message: event.target.value})}
              placeholder="Ask me anything about your market..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              rows="3"
              required
            />
          </div>
          
          <div className="flex justify-end mt-6">
            <button type="submit" className="px-8 py-3 bg-gradient-to-r from-emerald-700 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              Enter
            </button>
          </div>
        </form>
      </div>
      {/*END HERE*/}
      {/* Edit Item Form */}
      {editingItem && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-xl mb-8 shadow-lg border border-amber-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Edit Item
          </h2>
          <form onSubmit={updateItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Item Name"
                value={editingItem.name}
                onChange={(event) => setEditingItem({...editingItem, name: event.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={editingItem.description}
                onChange={(event) => setEditingItem({...editingItem, description: event.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={editingItem.price}
                onChange={(event) => setEditingItem({...editingItem, price: event.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                required
              />
            </div>
            
            {/* Message Text Box for Edit */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={editingItem.message}
                onChange={(event) => setEditingItem({...editingItem, message: event.target.value})}
                placeholder="Enter your message here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-vertical focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                rows="3"
                required
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button type="submit" className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                Update Item
              </button>
              <button 
                type="button" 
                onClick={() => setEditingItem(null)}
                className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Data List */}
      <div className="bg-white rounded-xl shadow-xl border border-gray-200">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200 rounded-t-xl">
          <h2 className="text-2xl font-semibold text-gray-600">
            Your Previous Chats
          </h2>
        </div>
        {data.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-xl text-gray-500 mb-2">No chats yet!</p>
            <p className="text-gray-400">Tell me about you business!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.map(item => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{item.data.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-2">Description: {item.data.description}</p>
                    <p className="text-gray-600 mb-2">Message: {item.data.message}</p>
                    <div className="">
                      <p className="text-xl font-bold text-green-600">${item.data.price}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 ml-4">
                    <button
                      onClick={() => setEditingItem({id: item.id, ...item.data})}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default App
