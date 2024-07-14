'use client';

import { useEffect } from 'react';

function AdminPage() {
  useEffect(() => {
    // page title
    document.title = 'Admin - Mona Edu';
  }, []);

  return (
    <>
      <div className='bg-white rounded-lg p-21 text-dark'>Admin Page</div>
    </>
  );
}

export default AdminPage;
