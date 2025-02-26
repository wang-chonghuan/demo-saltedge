import { useState } from 'react';
import { 
  CognitoIdentityProviderClient, 
  SignUpCommand,
  SignUpCommandInput,
  ConfirmSignUpCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { useAuth } from '../../contexts/AuthContext';

interface CognitoSignupProps {
  onClose: () => void;
}

const CognitoSignup = ({ onClose }: CognitoSignupProps) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    given_name: '',
    family_name: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const client = new CognitoIdentityProviderClient({
        region: import.meta.env.VITE_REGION,
      });

      const params: SignUpCommandInput = {
        ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
        Username: formData.username,
        Password: formData.password,
        UserAttributes: [
          {
            Name: 'email',
            Value: formData.email,
          },
          {
            Name: 'given_name',
            Value: formData.given_name,
          },
          {
            Name: 'family_name',
            Value: formData.family_name,
          },
        ],
      };

      const command = new SignUpCommand(params);
      await client.send(command);
      setShowVerification(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const client = new CognitoIdentityProviderClient({
        region: import.meta.env.VITE_REGION,
      });

      const command = new ConfirmSignUpCommand({
        ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
        Username: formData.username,
        ConfirmationCode: verificationCode,
      });

      await client.send(command);
      
      // Auto login after successful verification
      try {
        await login(formData.username, formData.password);
        setSuccess(true);
      } catch (loginError) {
        setError('Verification successful but login failed, please try manual login');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Cognito Signup</h2>

        {success ? (
          <div className="text-green-600 p-4">
            <h3 className="font-semibold text-lg mb-4">Login Successful!</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-2">
              <p><span className="font-medium">Username: </span>{formData.username}</p>
              <p><span className="font-medium">Email: </span>{formData.email}</p>
              <p><span className="font-medium">Given Name: </span>{formData.given_name}</p>
              <p><span className="font-medium">Family Name: </span>{formData.family_name}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Close
            </button>
          </div>
        ) : showVerification ? (
          <form onSubmit={handleVerification} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Verification Code</label>
              <input
                type="text"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter verification code from email"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Given Name</label>
              <input
                type="text"
                name="given_name"
                required
                value={formData.given_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Family Name</label>
              <input
                type="text"
                name="family_name"
                required
                value={formData.family_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Minimum 8 characters, including uppercase, lowercase, numbers and special characters"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CognitoSignup;
