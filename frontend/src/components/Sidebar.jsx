import React from 'react';

const Sidebar = ({ users, currentUser, onSelect }) => {
  return (
    <div className="w-64 bg-gray-100 h-full p-4 border-r">
      <h2 className="text-lg font-bold mb-4">Users</h2>
      <ul>
        {users.map(user => (
          <li
            key={user.id}
            className={`p-2 rounded cursor-pointer ${user.id === currentUser ? 'bg-blue-100' : ''}`}
            onClick={() => onSelect(user.id)}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
