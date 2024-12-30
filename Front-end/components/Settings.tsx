import React from 'react'

const Settings = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Name</label>
          <input type="text" id="name" name="name" className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input type="email" id="email" name="email" className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label htmlFor="currency" className="block mb-2">Preferred Currency</label>
          <select id="currency" name="currency" className="w-full p-2 border rounded">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Settings
        </button>
      </form>
    </div>
  )
}

export default Settings

