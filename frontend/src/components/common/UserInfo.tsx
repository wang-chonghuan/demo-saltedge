import { useAuth } from '../../contexts/AuthContext';

export const UserInfo = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-4">当前用户信息</h3>
      <div className="space-y-2">
        <p><span className="font-medium">用户名：</span>{user.username}</p>
        <p><span className="font-medium">邮箱：</span>{user.email}</p>
        <p><span className="font-medium">名字：</span>{user.given_name}</p>
        <p><span className="font-medium">姓：</span>{user.family_name}</p>
      </div>
    </div>
  );
};
