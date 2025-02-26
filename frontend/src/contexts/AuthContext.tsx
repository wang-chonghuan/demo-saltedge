import { createContext, useContext, useState, ReactNode } from 'react';
import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand,
  GetUserCommand
} from "@aws-sdk/client-cognito-identity-provider";

interface AuthUser {
  username: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  accessToken?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUserAndToken: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (username: string, password: string) => {
    const client = new CognitoIdentityProviderClient({
      region: import.meta.env.VITE_REGION,
    });

    const authCommand = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });

    try {
      const authResponse = await client.send(authCommand);
      const accessToken = authResponse.AuthenticationResult?.AccessToken;

      if (!accessToken) {
        throw new Error('No access token received');
      }

      // Get user attributes
      const getUserCommand = new GetUserCommand({
        AccessToken: accessToken,
      });

      const userResponse = await client.send(getUserCommand);
      
      const userAttributes = userResponse.UserAttributes?.reduce((acc, attr) => {
        if (attr.Name && attr.Value) {
          acc[attr.Name] = attr.Value;
        }
        return acc;
      }, {} as Record<string, string>);

      const userData: AuthUser = {
        username,
        email: userAttributes?.['email'],
        given_name: userAttributes?.['given_name'],
        family_name: userAttributes?.['family_name'],
        accessToken,
      };

      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const setUserAndToken = (userData: AuthUser) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUserAndToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
