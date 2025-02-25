# react-ts-tw-vite-fastapi-template

根据该模板项目创建一个新git的完整步骤是：

1. 先在GitHub/GitLab上手动创建一个新的空仓库（不要初始化README）

2. 然后在本地执行：
```
git clone <原仓库URL> <新项目名>
cd <新项目名>
rm -rf .git
git init
git add .
git commit -m "Initial commit"
git remote add origin <新仓库URL>
git push -u origin main
```

这样做的原因是：
- 需要一个新的空仓库来接收代码
- 删除旧的.git目录是为了清除原仓库的所有历史记录
- 重新init是为了开始全新的git历史
- 最后把代码推送到新建的仓库

这样你就得到了一个完全独立的、基于原仓库代码的新项目，没有任何历史关联。

# todo list 
google 登录
stripe 支付
supabase 数据库

