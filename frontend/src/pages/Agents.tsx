import { useState } from 'react';
import CognitoSignup from '../components/agents/CognitoSignup';

const Agents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const agentItems = [
    {
      title: "Cognito Signup",
      preview: "Test Cognito user registration functionality",
    },
    {
      title: "Financial Advisor",
      preview: "Get personalized financial advice and investment recommendations",
    },
    {
      title: "Budget Planner",
      preview: "Create and manage your monthly budget with smart suggestions",
    },
    {
      title: "Expense Tracker",
      preview: "Automatically categorize and track your spending habits",
    },
    {
      title: "Bill Payment Assistant",
      preview: "Never miss a payment with automated bill reminders and scheduling",
    },
    {
      title: "Tax Calculator",
      preview: "Estimate your tax obligations and find potential deductions",
    }
  ];

  const handleAgentClick = (title: string) => {
    if (title === "Cognito Signup") {
      setShowSignupModal(true);
    } else {
      console.log(`Selected agent: ${title}`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 mt-[--topbar-h] mb-[--bottombar-h]">
      {loading && <div className="bg-blue-100 p-4 mb-4 rounded-lg">Loading...</div>}
      {error && <div className="bg-red-100 p-4 mb-4 rounded-lg text-red-700">{error}</div>}
      
      {agentItems.map((item, i) => (
        <div 
          key={i} 
          className="bg-white rounded-lg shadow p-4 mb-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          onClick={() => handleAgentClick(item.title)}
        >
          <h3 className="text-md font-medium mb-2">{item.title}</h3>
          <p className="text-gray-600">{item.preview}</p>
        </div>
      ))}

      {showSignupModal && (
        <CognitoSignup
          onClose={() => setShowSignupModal(false)}
        />
      )}
    </div>
  );
};

export default Agents;