import { useState, useEffect } from 'react'
import SideBar from './assets/component/SideBar';
import { AlignJustify } from 'lucide-react';


function App() {
  const [data, setData] = useState([])
  const [newItem, setNewItem] = useState({ id: '', message: '' })
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
    if (!newItem.id.trim() || !newItem.message.trim()) {
      alert('Please fill in all fields before saving.')
      return
    }
    
    console.log('API_URL:', API_URL)
    console.log('Sending data:', { id: newItem.id, data: { message: newItem.message } })
    
    try {
      const response = await fetch(`${API_URL}/api/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newItem.id,
          data: {message: newItem.message }
        })
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('Success response:', responseData)
        setNewItem({ id: '', message: '' })
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
  /*const updateItem = async (event) => {
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
  }*/

  // DELETE: Remove data item (HTTP DELETE) (delete from chat histroy)
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

  // --- AI Chat Bot UI State ---
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  // Connect AI chat bot input to /api/data instead of /api/chat
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: "user", text: chatInput }]);
    const userMessage = chatInput;
    setChatInput("");
    try {
      // Use timestamp as id for chat messages
      const chatId = Date.now().toString();
      const response = await fetch(`${API_URL}/api/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: chatId,
          data: { message: userMessage }
        })
      });
      if (response.ok) {
        const data = await response.json();
        // Optionally show confirmation or echo message
        setChatMessages(prev => [...prev, { role: "ai", text: "Loading. Please give me a few seconds!" }]);
      } else {
        const errorText = await response.text();
        setChatMessages(prev => [...prev, { role: "ai", text: `Error: ${response.status} - ${errorText}` }]);
      }
    } catch (error) {   
      setChatMessages(prev => [...prev, { role: "ai", text: `Network error: ${error.message}` }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-bold font-mono mb-8 text-green-800">BrandAid</h1>
        

        {/* AI Chat Bot UI */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-100 p-6 rounded-xl mb-8 shadow-lg border border-purple-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-600">Your Research Assistant</h2>
          <div className="flex flex-col gap-4">
            {/* Chat Output */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 h-48 overflow-y-auto mb-2">
              {chatMessages.length === 0 ? (
                <div className="text-gray-400 text-center mt-12">No messages yet. Tell me about your business!</div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div key={idx} className={msg.role === "user" ? "text-right mb-2" : "text-left mb-2"}>
                    <span className={msg.role === "user" ? "inline-block bg-blue-100 text-blue-800 px-3 py-2 rounded-lg" : "inline-block bg-emerald-100 text-emerald-800 px-3 py-2 rounded-lg"}>
                      {msg.text}
                    </span>
                  </div>
                ))
              )}
            </div>
            {/* Chat Input + Enter Button */}
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              />
              <button type="submit" className="px-8 py-3 bg-gradient-to-r from-emerald-700 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                Enter
              </button>
            </form>
          </div>
        </div>

        {/* Create Item Form with Message */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl mb-8 shadow-lg border border-blue-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-600">
            Chat History 
          </h2>
        
          <form onSubmit={createItem} className="space-y-4">
                
          </form>
        </div>

        <div className="top-6 left-6 fixed z-50 ">
          <AlignJustify color="red" size={30} />
        </div>
      </div>
    </div>
  )
}



export default App
