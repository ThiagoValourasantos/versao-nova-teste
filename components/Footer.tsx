
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Agentic RFP. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
